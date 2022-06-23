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
  genericComponentTokenizer,
  tokenizeName
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
    component.containing_frame?.name?.toLowerCase().includes('spacing')
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
    component.containing_frame?.name?.toLowerCase().includes('alert')
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
  !component.containing_frame?.name?.toLowerCase().includes('spacing')?returnFunction(component,data):undefined);
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

    // TODO move all of the finding common components logic into it's own function

    // fill in vars for design tokens that don't have values
    // we leave tokens that should reference tokens as undefined
    // TODO this does not work with text - we'll need to expand it to create multiple tokens for text
    componentTokens.forEach((designToken, index) => {
      if(designToken.componentName && designToken.node_id){
        designTokens.every((findMatchingToken) => {
          if(
            findMatchingToken.componentName === undefined &&
            designToken.node_id == findMatchingToken.node_id
          ){
            componentTokens[index].value = `var(${ findMatchingToken.token })`;
            return false; //Break
          }
          return true;
        });
      }
    });

    // remove not set values
    componentTokens = componentTokens.filter((designToken)=>designToken.value!=='undefined');



    type ComponentTypes = {
      [component: string]: {
        [componentVariant: string]: string[],
      },
    };
    // find all the variants available for the Components
    // we use this list to help sort the components
    // we could also use this list to help create a framework for the devs
    // TODO: Publish this as a comment token, the structure of the data would be very helpful
    const componentTypes: ComponentTypes = {};
    componentTokens.forEach((designToken)=>{
      if(!designToken.componentName || !designToken.name) return false;
      if(!(designToken.componentName in componentTypes)) componentTypes[designToken.componentName] = {};
      for(const variant in designToken.componentVariant){
        if(!(variant in componentTypes[designToken.componentName])) {
          componentTypes[designToken.componentName][variant] = [];
        }
        if(!componentTypes[designToken.componentName][variant].includes(designToken.componentVariant[variant])){
          componentTypes[designToken.componentName][variant].push(designToken.componentVariant[variant]);
        }
      }
    });

    type GroupedByName = {
      [name: string]: DesignToken[],
    };
    type GroupedByNameAsValue = {
      [name: string]: string[],
    };

    // we now iterate over all of the token variants
    // we look at each variant and find common variables
    Object.entries(componentTypes).forEach(([name,variants])=>{
      // get just the design tokens for the component
      const componentTokensVariants = componentTokens.filter(({ componentName }) => componentName === name);

      for(const variant in variants){
        for(const variantType in variants[variant]){
          
          // find the components that match the current variant 
          const localComponentTokens = componentTokensVariants.filter(({ componentVariant }) =>{
            if(!componentVariant) return false;
            return componentVariant[variant] === variants[variant][variantType];
          });

          // create groups of each type
          // design tokens names are the same across multiple tokes because they are from the same variant
          // we group them by variant so we can find the same values across variants
          const groupedByName = localComponentTokens.reduce((groups: GroupedByName, item) => {
            const group = groups[item.name] || [];
            group.push(item);
            groups[item.name] = group;
            return groups;
          }, {});

          // Find just the values of the variants
          const groupByNameAsValue: GroupedByNameAsValue = {};
          for( const group in groupedByName ){
            groupByNameAsValue[group] = groupedByName[group].map((designToken)=>designToken.value);
          }

          // find the common values
          // we use the first variant as the starting variant
          let commonValues: string[] = [];
          let first = true;
          for( const group in groupByNameAsValue ){
            if(first) {
              commonValues = groupByNameAsValue[group];
              first = false;
            }
            commonValues = commonValues.filter((value)=>groupByNameAsValue[group].includes(value));
          }

          // create new design tokens for the variants
          for( const newValue in commonValues ){
            componentTokens.push({
              type: componentTokensVariants[0].type,
              name: `${ componentTokensVariants[0].componentName } ${ variants[variant][variantType] }`,
              token: `--${ tokenizeName(`
              ${ componentTokensVariants[0].componentName } 
              ${ variants[variant][variantType] } 
              -${ newValue }`) }`,
              componentName:componentTokensVariants[0].componentName,
              value: commonValues[newValue]
            });
          }
        }
      }
    });
    
    // remove the design tokens previously generated, keeping only the shared tokens
    componentTokens = componentTokens.filter((designToken) => !designToken.componentVariant);

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
