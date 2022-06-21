//validator //loader/parse //tokenizer
import axios, { AxiosError } from 'axios';
import { StyleMetadata, ComponentMetadata, GetFileComponentsResult } from 'figma-api/lib/api-types';
import { StyleType } from 'figma-api/lib/ast-types';
import { groupByType } from '../lib/radius-styles';
import { DesignToken, FigmaFileNodes, NodeDocument, NodeRoot } from './figma.utils';
import { NodeFilter, DesignTokenFilter } from './types/FigmaTypes';
import { 
  colorDesignTokenizer,
  processElevationTokenizer, 
  typographyTokenizer, 
  gridTokenizer, 
  spacingTokenizer,
  genericComponentTokenizer
} from './figma.tokenizer';

//Utility methods 
export const getFileKey = (url: string) => {
  if(!url.includes('http') && url.length < 30) return url; //the url provided already the key
  let fileKey = url.match(/\/file\/(\w*)\//);
  if(fileKey && fileKey.length > 1) return fileKey[1];

  fileKey = url.match(/\/files\/(\w*)\//);
  if(fileKey && fileKey.length > 1) return fileKey[1];

  throw Error('Could not find the file URL in the figma file');
};


const isArray = (dToken: DesignToken | DesignToken[]): dToken is DesignToken[] => {
  if(Array.isArray(dToken)) return true;
  return false;
}; 

// Functions
export const filterFunctions: NodeFilter[] = [];
export const designTokenFunctions: DesignTokenFilter[]|undefined = [];

const spacingFilter: NodeFilter = (
  component: ComponentMetadata,
  data: NodeRoot, 
  designTokenFilterFn: DesignTokenFilter
): DesignToken| DesignToken[] | undefined => {
  if(
    component.containing_frame?.name.toLowerCase().includes('spacer'),
    data.document.type === 'COMPONENT' &&
    data.document.absoluteBoundingBox &&
    data.document.children.length > 0
  ) {
    return designTokenFilterFn(component,data);
  }
  return undefined;
};

const attentionFilter: NodeFilter = (
  component: ComponentMetadata,
  data: NodeRoot, 
  designTokenFilterFn: DesignTokenFilter
): DesignToken| DesignToken[] | undefined => {
  if(
    component.containing_frame?.name.toLowerCase().includes('alert')
  ) {
    return designTokenFilterFn(component,data);
  }
  return undefined;
};

export const convertComponentNodesToTokens = (
  components: ComponentMetadata[], nodes: NodeRoot[]
): DesignToken[] => {
  let designTokens: DesignToken[] = [];

  components.forEach((component) => {
    const node = nodes.filter((filterNode)=>filterNode.document.id === component.node_id)[0];
    if(!node) return;
    filterFunctions.forEach((filterMethod, index) => {
      const dToken = filterMethod(component,node, designTokenFunctions[index]);
      if(dToken){
        isArray(dToken) ?
          designTokens = [...designTokens, ...dToken] : designTokens.push(dToken);
      }
    });
  });

  return designTokens;
};


// // These methods have to be passed in order. Methods are run sequentially
filterFunctions.push(spacingFilter);
designTokenFunctions.push(spacingTokenizer);

filterFunctions.push(attentionFilter);
designTokenFunctions.push(genericComponentTokenizer);

filterFunctions.push((component,data,returnFunction) => 
  component.containing_frame?.name.toLowerCase().includes('button')?returnFunction(component,data):undefined);
designTokenFunctions.push(genericComponentTokenizer);

export const processStyleNodes = (data: NodeDocument, type: StyleType): DesignToken[] | DesignToken | undefined => {
  switch(type){
    case 'FILL':
      return colorDesignTokenizer(data);
    case 'TEXT':
      return typographyTokenizer(data);
    case 'EFFECT':
      return processElevationTokenizer(data);
    case 'GRID':
      return gridTokenizer(data);
    default:
      break;
  }
}; 

export const convertStyleNodesToTokens = (nodes: { [key: string]: NodeRoot }, styles: StyleMetadata[]) => {
  let designTokens: DesignToken[] = [];
  for(const index in styles){
    const key = styles[index].node_id;
    const newDesignToken = processStyleNodes(nodes[key]?.document,styles[index].style_type);
    if(newDesignToken){
      isArray(newDesignToken) ?
        designTokens = [...designTokens, ...newDesignToken] : designTokens.push(newDesignToken);
    }
  }
  return designTokens;
};

//figmaAPIFactory is used in other files 
export const figmaAPIFactory = (token: string) => {

  // Retrieves node data from figma api 
  const getData = (urlInput: string) => {
    return axios.get(urlInput, {
      headers: {
        'X-FIGMA-TOKEN': token
      }
    }).then((res) => 
      res.data
    ).catch((_error: AxiosError)=>{
      // console?.error(`Error ${ _error?.response?.data } --- Error Code ${ _error?.code }`);
      throw new  TypeError(`Failed to parse figma url, ${ urlInput }`);
    });
  };

  // GET 
  const getStyles = (fileKey: string): Promise<StyleMetadata[]> =>{
    return getData(`https://api.figma.com/v1/files/${ fileKey }/styles`).then(({ meta: { styles } }) => {
      if(styles.length === 0) throw Error('There are no styles, make sure the figma file is published.');
      return styles;
    });
  };

  const getComponents = (fileKey: string): Promise<ComponentMetadata[]|undefined> => {
    return getData(`https://api.figma.com/v1/files/${ getFileKey(fileKey) }/components`)
      .then((data: GetFileComponentsResult) => {
        return data?.meta?.components;
      });
  };

  // const DesignTokenComponents = [
  //   'spacer',
  //   'spacers',
  //   'spacing',
  //   'border radius',
  //   'borderradius',
  //   'button',
  //   'attention box',
  //   'alert'
  // ];
  // const filterComponentsForDesignTokens = (components: ComponentMetadata[]) => {
  //   return components.filter((component: ComponentMetadata) => {
  //     if(!component?.containing_frame?.name) return false;
  //     // console.log(
  //     //   component.containing_frame.name.toLowerCase(),
  //     //   DesignTokenComponents.includes(component.containing_frame.name.toLowerCase())
  //     // );
  //     if(DesignTokenComponents.includes(component.containing_frame.name.toLowerCase())) return true;
  //     return false;
  //   });
  // };

  const getNodes = (fileKey: string, nodeIds: string[])=> {
    // TODO break the long node requests into small requests
    // https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(",")}
    return getData(`https://api.figma.com/v1/files/${ getFileKey(fileKey) }/nodes?ids=${ nodeIds.join(',') }`)
      .then((data: FigmaFileNodes) => { return data.nodes;});
  };


  const processStyles = async (fileKey: string) => {
    const parsedFileKey = getFileKey(fileKey);  
    const figmaStyles = await getStyles(parsedFileKey);
    
    const nodeIds = figmaStyles.map((style: StyleMetadata)=>style.node_id);
    const nodes = await getNodes(parsedFileKey, nodeIds);

    let designTokens = convertStyleNodesToTokens(nodes,figmaStyles).filter((designToken)=>!!designToken.name);
    const componentTokens = await processStyleComponents(parsedFileKey, designTokens);
    
    designTokens = [...designTokens,...componentTokens];

    designTokens.sort((first: DesignToken,second: DesignToken)=>{
      if(first.token && second.token && first.token > second.token) return -1;
      if(first.name && second.name && first.name.toLowerCase() > second.name.toLowerCase()) return -1;
      return 1;
    });

    // // groups them all
    return groupByType(designTokens);
  };

  const processStyleComponents = async (fileKey: string, designTokens: DesignToken[]) => {
    // Get design tokens from components //Grid, Spacing, Border Radius
    const figmaComponents = await getComponents(fileKey);
    if(!figmaComponents) throw Error('Failed to get the components');
    // const dTComponents = figmaComponents;//filterComponentsForDesignTokens(figmaComponents);
    const dTComponentNodes = await getNodes(
      fileKey,
      figmaComponents.map((components: ComponentMetadata) => components.node_id)
    );
    const componentNodeDocuments: NodeRoot[] = [];
    Object.keys(dTComponentNodes).forEach(
      (nodeKey: string) => {
        const componentNode = dTComponentNodes[nodeKey];
        componentNodeDocuments.push(componentNode);
      }
    );

    let componentTokens = convertComponentNodesToTokens(figmaComponents,componentNodeDocuments);


    // fill in vars for design tokens that don't have values
    // we leave tokens that should reference tokens as undefined
    componentTokens.forEach((designToken, index) => {
      if(designToken.value === 'undefined' && designToken.node_id){
        designTokens.every((findMatchingToken) => {
          if(
            findMatchingToken.value !== 'undefined' &&
            designToken.node_id == findMatchingToken.node_id
          ){
            componentTokens[index].value = `var(${ findMatchingToken.token })`;
            return false; //Break
          }
          return true;
        });
      }
    });

    // reduce the common props for components
    // remove all the repeated component values
    const components: { [key: string]: DesignToken[] } = {};
    componentTokens.forEach((designToken)=>{
      if(designToken.componentName){
        designToken.componentName in components? 
          components[designToken.componentName].push(designToken):
          components[designToken.componentName] = [designToken];
      }
    });

    componentTokens = componentTokens.filter((designToken)=>!designToken.componentName);


    // type Variants = {
    //   [component: string]: {
    //     [variant: string]: {
    //       [value: string]:  string[],
    //     },
    //   },
    // };
    type Variants = {
      [component: string]: {
        [name: string]: DesignToken[],
      },
    };

    
    const variants: Variants = {};
    // component
    // type root (all common for that type)
    Object.entries(components).forEach(([name ,tokens]: [string,DesignToken[]])=>{
      variants[name] = {};
      const currentVariant = variants[name];
      Object.values(tokens).forEach((designToken: DesignToken) => {
        if(designToken.componentVariant){
          const tokenName = designToken.name;
          if( tokenName in currentVariant){
            currentVariant[tokenName].push(designToken);
          } else {
            currentVariant[tokenName] = [designToken];
          }
        }
      });


      if(!tokens[0].componentVariant) return false;
      Object.keys(tokens[0].componentVariant).forEach((_variantKey)=>{
        // const variantComponents = currentVariant.filter((designToken) => 
        //   designToken.componentVariant[variantKey] === currentVariant
        // );
        let componentCommon: string[] = [];
        let first = true;
        Object.entries(currentVariant).forEach((data)=>{
          if(first) {
            componentCommon = data[1].map((designToken) => designToken.value ).filter((value) => value !== 'undefined');
            first = false;
          }
          const values = data[1].map((designToken) => designToken.value ).filter((value) => value !== 'undefined');
          componentCommon = componentCommon.filter((value)=>values.includes(value));
        });
      });
      // console.log(componentCommon);
    });


    console.log(variants);

    // for(let index = designTokens.length; index >= 0; index = index - 1){
    //   if()
    // }


    return componentTokens;
  };

  return {
    _getComponents: getComponents,
    _getData: getData,
    _getNodes: getNodes,
    _getStyles: getStyles,
    _processStyleComponents:processStyleComponents,
    processStyles
  };
};
