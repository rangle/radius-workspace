//validator //loader/parse //tokenizer
import axios, { AxiosError } from 'axios';
import { StyleMetadata, ComponentMetadata } from 'figma-api/lib/api-types';
import { StyleType } from 'figma-api/lib/ast-types';
import { groupByType } from '../lib/radius-styles';
import { DesignToken, FigmaFileNodes, NodeDocument, NodeRoot } from './figma.utils';
import { NodeFilter, DesignTokenFilter } from './types/FigmaTypes';
import { colorDesignTokenizer,processElevationTokenizer, typographyTokenizer } from './figma.tokenizer';


//Utility methods 
export const getFileKey = (url: string) => {
  const fileKey = url.match(/\/file\/(\w*)\//);
  if(fileKey && fileKey.length > 1) return fileKey[1];
  throw Error('Could not find the file URL in the figma file');
};

export const generateToken = (name: string) => {
  return `--${ name.toLowerCase().split('/').join('-').split(' ').join('-') }`;
};

// Functions
export const filterFunctions: NodeFilter[] = [];
export const designTokenFunctions: DesignTokenFilter[] = [];


export const processStyleNodes = (data: NodeDocument, type: StyleType): DesignToken[] | DesignToken | undefined => {
  switch(type){
    case 'FILL':
      return colorDesignTokenizer(data);
    case 'TEXT':
      return typographyTokenizer(data);
    case 'EFFECT':
      return processElevationTokenizer(data);
    default:
      break;
  }
}; 


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

// export const convertNodesToTokens = (nodes: NodeDocument[]): DesignToken[] => {
//   const designTokens: DesignToken[] = [];
//   nodes.forEach((node) => {
//     filterFunctions.forEach((filterMethod, index) => {
//       const dToken = filterMethod(node, designTokenFunctions[index]);
//       designTokens.push(dToken);
//     });
//   });
//   return designTokens;
// };

// // These methods have to be passed in order. Methods are run sequentially
// filterFunctions.push(colorFilter,typographyFilter);
// designTokenFunctions.push(colorDesignTokenizer);

export const convertStyleNodesToTokens = (nodes: { [key: string]: NodeRoot }, styles: StyleMetadata[]) => {
  let designTokens: DesignToken[] = [];
  for(const index in styles){
    const styleId = styles[index].node_id;
    console.log(styleId);
    const newTokens = processStyleNodes(nodes[styleId]?.document,styles[index].style_type);
    if(newTokens){
      if(Array.isArray(newTokens)){
        designTokens = designTokens.concat(newTokens);
      } else {
        designTokens.push(newTokens);
      }
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
      // for saving mock data for testing
      // import fs from 'fs';
      // fs.writeFile(`${ new Date().getTime() }.json`, JSON.stringify({ data:res.data }),{},()=>{console.log(urlInput);});
    ).catch((error: AxiosError)=>{
      console.error(`Error ${ error?.response?.data } --- Error Code ${ error?.code }`);
      throw new TypeError('Failed to parse figma url');
    });
  };

  // GET 
  const getStyles = (fileKey: string): Promise<StyleMetadata[]> =>{
    if(fileKey.includes('http')){
      fileKey = getFileKey(fileKey);
    }
    return getData(`https://api.figma.com/v1/files/${ fileKey }/styles`).then(({ meta: { styles } }) => {
      return styles;
    });
  };

  const getComponents = (fileKey: string): Promise<ComponentMetadata> => {
    if(fileKey.includes('http')){
      fileKey = getFileKey(fileKey);
    }
    return getData(`https://api.figma.com/v1/files/${ fileKey }/components`).then((data: ComponentMetadata) => {
      console.log(data);
      return data;
    });
  };

  const getNodes = (fileKey: string, nodeIds: string[])=> {
    // console.log(fileKey);
    // TODO break the long node requests into small requests
    // https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(",")}
    return getData(`https://api.figma.com/v1/files/${ fileKey }/nodes?ids=${ nodeIds.join(',') }`)
      .then((data: FigmaFileNodes) => { return data.nodes;});
  };

  // const flattenNodes = (nodes: FigmaNodeKey): NodeDocument[] => {
  //   return Object.keys(nodes).map((key) => {
  //     return nodes[key].document;
  //   });
  // };

  const processStyles = async (fileKey: string) => {
    const figmaStyles = await getStyles(fileKey);
    
    const nodeIds = figmaStyles.map((style: StyleMetadata)=>style.node_id);
    const nodes = await getNodes(fileKey, nodeIds);

    const designTokens = convertStyleNodesToTokens(nodes,figmaStyles);
    // // groups them all
    return groupByType(designTokens);
  };

  return {
    _getComponents: getComponents,
    _getData: getData,
    _getNodes: getNodes,
    _getStyles:getStyles,
    processStyles
  };
};
