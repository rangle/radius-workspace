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
  spacingTokenizer ,
  buttonTokenizer
} from './figma.tokenizer';


//Utility methods 
export const getFileKey = (url: string) => {
  if(!url.includes('http') && url.length < 30) return url; //the url provided already the key
  const fileKey = url.match(/\/file\/(\w*)\//);
  if(fileKey && fileKey.length > 1) return fileKey[1];
  throw Error('Could not find the file URL in the figma file');
};


const isArray = (dToken: DesignToken | DesignToken[]): dToken is DesignToken[] => {
  if(Array.isArray(dToken)) return true;
  return false;
}; 

// export const generateToken = (name: string) => {
//   return `--${ name.toLowerCase().split('/').join('-').split(' ').join('-') }`;
// };

// Functions
export const filterFunctions: NodeFilter[] = [];
export const designTokenFunctions: DesignTokenFilter[]|undefined = [];

// const colorFilter: NodeFilter = (data: NodeDocument, designTokenFilterFn: DesignTokenFilter): DesignToken => {
//   if(data.type == 'RECTANGLE') {
//     data.type = 'color';
//   }
//   const colorToken = designTokenFilterFn(data);
//   return colorToken;
// };

// const typographyFilter: NodeFilter = (data: NodeDocument, designTokenFilterFn: DesignTokenFilter): DesignToken => {
//   if(data.type == 'RECTANGLE') {
//     data.type = 'color';
//   }
//   const colorToken = designTokenFilterFn(data);
//   return colorToken;
// };

const spacingFilter: NodeFilter = (
  data: NodeDocument, designTokenFilterFn: DesignTokenFilter
): DesignToken| undefined => {
  if(
    data.type === 'COMPONENT' &&
    data.absoluteBoundingBox &&
    data.children.length > 0
  ) {
    return designTokenFilterFn(data);
  }
  return undefined;
};

const buttonFilter: NodeFilter = (
  data: NodeDocument, designTokenFilterFn: DesignTokenFilter
): DesignToken| undefined => {
  console.log(data);
  if(
    data.type === 'COMPONENT' &&
    data.absoluteBoundingBox &&
    data.children.length > 0
  ) {
    return designTokenFilterFn(data);
  }
  return undefined;
};


export const convertComponentNodesToTokens = (nodes: NodeDocument[]): DesignToken[] => {
  let designTokens: DesignToken[] = [];
  nodes.forEach((node) => {
    filterFunctions.forEach((filterMethod, index) => {
      const dToken = filterMethod(node, designTokenFunctions[index]);
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

filterFunctions.push(buttonFilter);
designTokenFunctions.push(buttonTokenizer);

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



// type FigmaComponent = {
//   componentProperty: string,
//   components_node_id: string[],
//   node_id: string[],
//   node: NodeRoot[],
//   properties: {
//     [name: string]: string[],
//   },
// };

// const figmaComponent: FigmaComponent = {
//   componentProperty:"",
//   components_node_id:[],
//   node_id:[],
//   node:[],
//   properties: {
//     type: ["primary", "secondary", "tertiary"],
//     state: [],
//     size: []
//   }
// }

// properties: {
//   type: {
//     primary: '#hexadecimal',
//     secondary: '#dfewrew'
//   }
// }


// --primary-button-color: var(--primary-)
// --primary-button-color-3

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
      throw new TypeError(`Failed to parse figma url, ${ urlInput }`);
    });
  };

  // GET 
  const getStyles = (fileKey: string): Promise<StyleMetadata[]> =>{
    if(fileKey.includes('http')){
      fileKey = getFileKey(fileKey);
    }
    return getData(`https://api.figma.com/v1/files/${ fileKey }/styles`).then(({ meta: { styles } }) => {
      if(styles.length === 0) throw Error('There are no styles, make sure the figma file is published.');
      return styles;
    });
  };

  const getComponents = (fileKey: string): Promise<ComponentMetadata[]|undefined> => {
    if(fileKey.includes('http')){
      fileKey = getFileKey(fileKey);
    }
    return getData(`https://api.figma.com/v1/files/${ fileKey }/components`).then((data: GetFileComponentsResult) => {
      return data?.meta?.components;
    });
  };

  // We filter for name of components
  // Returns only the componets we are looking for 
  // TODO - extend what type of components we are filtering
  const DESIGN_TOKEN_COMPONENTS_ARRAY: string[] = [
    'spacer','spacers','spacing','border radius','borderradius','button'
  ];
  const filterComponentsForDesignTokens = (components: ComponentMetadata[]) => {
    return components.filter((component: ComponentMetadata) => {
      if(!component?.containing_frame?.name) return false;
      if(DESIGN_TOKEN_COMPONENTS_ARRAY.includes(component.containing_frame.name.toLowerCase())) return true;
      return false;
    });
  };

  const FIGMA_COMPONENTS_ARRAY: string[] = ['button'];
  const filterComponentVariants = (components: ComponentMetadata[]) => {
    return components.filter((component: ComponentMetadata) => {
      if(!component?.containing_frame?.name) return false;
      if(FIGMA_COMPONENTS_ARRAY.includes(component.containing_frame.name.toLowerCase())) return true;
      return false;
    });
  };


  

  const getNodes = (fileKey: string, nodeIds: string[])=> {
    // TODO break the long node requests into small requests
    // https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(",")}
    return getData(`https://api.figma.com/v1/files/${ fileKey }/nodes?ids=${ nodeIds.join(',') }`)
      .then((data: FigmaFileNodes) => { return data.nodes;});
  };


  const processStyles = async (fileKey: string) => {
    const parsedFileKey = getFileKey(fileKey);  
    const figmaStyles = await getStyles(parsedFileKey);
    
    const nodeIds = figmaStyles.map((style: StyleMetadata)=>style.node_id);
    const nodes = await getNodes(parsedFileKey, nodeIds);

    let designTokens = convertStyleNodesToTokens(nodes,figmaStyles);
    const componentTokens = await processStyleComponents(parsedFileKey);
    designTokens = [...designTokens,...componentTokens];

    designTokens.sort((first: DesignToken,second: DesignToken)=>{
      if(first.name && second.name && first.name.toLowerCase() > second.name.toLowerCase()) return -1;
      return 1;
    });

    // // groups them all
    return groupByType(designTokens);
  };

  const processStyleComponents = async (fileKey: string) => {

    // Get design tokens from components //Grid, Spacing, Border Radius
    const figmaComponents = await getComponents(fileKey);
    if(!figmaComponents) throw Error('Failed to get the components');
    const dTComponents = filterComponentsForDesignTokens(figmaComponents);
    const dTComponentNodes = await getNodes(
      fileKey,
      dTComponents.map((components: ComponentMetadata) => components.node_id)
    );


    const ComponentVariants = filterComponentVariants(figmaComponents);
    const figmaComponentNodes = await getNodes(
      fileKey,
      ComponentVariants.map((components: ComponentMetadata) => components.node_id)
    );
    console.log(figmaComponentNodes);
  

    // const figmaComponentProperties = parseProperties(figmaComponents);



    const componentNodeDocuments: NodeDocument[] = [];
    Object.keys(dTComponentNodes).forEach(
      (nodeKey: string) => {
        const componentNode = dTComponentNodes[nodeKey];
        componentNodeDocuments.push(componentNode.document);
      }
    );

    return convertComponentNodesToTokens(componentNodeDocuments);
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
