//validator //loader/parse //tokenizer
import axios, { AxiosError } from 'axios';
import { StyleMetadata, ComponentMetadata, GetFileComponentsResult } from 'figma-api/lib/api-types';
import { StyleType } from 'figma-api/lib/ast-types';
import { groupByType } from '../lib/radius-styles';
import { DesignToken, FigmaFileNodes, NodeDocument, NodeRoot } from './figma.utils';
import { NodeFilter, DesignTokenFilter, TypographyMap } from './types/FigmaTypes';
import { 
  colorDesignTokenizer,
  processElevationTokenizer, 
  gridTokenizer, 
  spacingTokenizer, 
  generateBaseTypographyTokens,
  generateSemanticTypographyTokens,
  getTypographyDesignTokens
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

//TODO: kept for reference 
// const colorFilter: NodeFilter = (data: NodeDocument, designTokenFilterFn: DesignTokenFilter): DesignToken => {
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

export const processStyleNodes = (data: NodeDocument, type: StyleType): DesignToken[] | DesignToken | undefined => {
  switch(type){
    case 'FILL':
      return colorDesignTokenizer(data);
    // case 'TEXT':
    //   return typographyTokenizer(data);
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

  const DesignTokenComponents = ['spacer','spacers','spacing','border radius','borderradius'];
  const filterComponentsForDesignTokens = (components: ComponentMetadata[]) => {
    return components.filter((component: ComponentMetadata) => {
      if(!component?.containing_frame?.name) return false;
      if(DesignTokenComponents.includes(component.containing_frame.name.toLowerCase())) return true;
      return false;
    });
  };

  const getNodes = (fileKey: string, nodeIds: string[])=> {
    // TODO break the long node requests into small requests
    // https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(",")}
    return getData(`https://api.figma.com/v1/files/${ fileKey }/nodes?ids=${ nodeIds.join(',') }`)
      .then((data: FigmaFileNodes) => { return data.nodes;});
  };

  // TypographyMap object used within processStyles
  const typographyMap: TypographyMap = {
    fontSize: {},
    fontWeight: {},
    letterSpacing: {},
    fontSemanticSize: {}
  };

  const processStyles = async (fileKey: string) => {
    const parsedFileKey = getFileKey(fileKey);  
    const figmaStyles = await getStyles(parsedFileKey);
    const nodeIds = figmaStyles.map((style: StyleMetadata)=>style.node_id);
    const nodes = await getNodes(parsedFileKey, nodeIds);

    generateBaseTypographyTokens(nodes, typographyMap);
    generateSemanticTypographyTokens(nodes, typographyMap);
    //translate token map to design tokens
    const typographyDesignToken = getTypographyDesignTokens(typographyMap);

    let designTokens = convertStyleNodesToTokens(nodes,figmaStyles);
    const componentTokens = await processStyleComponents(parsedFileKey);
    designTokens = [...designTokens,...componentTokens, ...typographyDesignToken ];

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
