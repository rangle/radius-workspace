//validator //loader/parse //tokenizer
import axios, { AxiosError } from 'axios';
import { StyleMetadata } from 'figma-api/lib/api-types';
import { groupByType } from '../lib/radius-styles';
import { DesignToken, colorToHex, NodeDoc, FigmaFileNodes, NodeDocument, FigmaNodeKey } from './figma.utils';
// import { groupBy } from './common.utils';
export type StyleResponse = {
  meta: {
    styles: StyleDescriptor[],
  },
};
export type StyleDescriptor = {
  key: string,
  file_key: string,
  node_id: string,
  style_type: string,
  thumbnail_url: string,
  name: string,
  description: string,
  created_at: string,
  updated_at: string,
  user: User,
  sort_position: string,
};
type User = {
  id: string,
  handle: string,
  img_url: string,
};

type GetStylesListType = {
  nodes: string[],
  styles: {
    [key: string]: StyleMetadata,
  },
};

type FigmaStyle = {
  [key: string]: StyleMetadata, 
};

type DesignTokenFilter = (node: NodeDocument) => DesignToken;
type NodeFilter = (data: NodeDocument, node: DesignTokenFilter) => DesignToken;


export const getFileKey = (url: string) => {
  const fileKey = url.match(/\/file\/(\w*)\//);
  if(fileKey && fileKey.length > 1) return fileKey[1];
  throw Error('Could not find the file URL in the figma file');
};

export const generateToken = (name: string) => {
  return `--${ name.toLowerCase().split('/').join('-').split(' ').join('-') }`;
};

export const parseGRID = (style: StyleDescriptor, target: NodeDoc) => {
  const tokenOutput: DesignToken = {
    type: 'breakpoint',
    name: target.name,
    token: generateToken(target.name),
    value: 'default'
  };
  if(style.description.includes('--')){
    //taking style finding value with gm and assigning to tokenValue 
    //TODO rewrite token to have two fields, name and value 
    const matched = style.description.match(/--[a-zA-Z0-9/-]*/gm);
    if(matched) tokenOutput.token = matched[0];
    const matchViewport = style.description.match(/--([0-9a-zA-Z]*)-/m);
    if(matchViewport && matchViewport.length >= 2) tokenOutput.viewPort = matchViewport[1];
  }
  if(style.description.includes('px')){
    const matched = style.description.match(/([0-9]*)px/m);
    if(matched && matched.length >= 2) tokenOutput.value = matched[1];
  }

  return tokenOutput;
};

// Functions
export const filterFunctions: NodeFilter[] = [];
export const designTokenFunctions: DesignTokenFilter[] = [];

const colorDesignTokenizer: DesignTokenFilter = (node: NodeDocument): DesignToken => {
  colorToHex(node.fills[0].color);
  const colorToken: DesignToken = {
    type: 'color' ,
    name: node.name,
    token: generateToken(node.name),
    value: colorToHex(node.fills[0].color)
  };
  return colorToken;
};

const colorFilter: NodeFilter = (data: NodeDocument, designTokenFilterFn: DesignTokenFilter): DesignToken => {
  if(data.type == 'RECTANGLE') {
    data.type = 'color';
  }
  const colorToken = designTokenFilterFn(data);
  return colorToken;
};

export const convertNodesToTokens = (nodes: NodeDocument[]): DesignToken[] => {
  const designTokens: DesignToken[] = [];
  nodes.forEach((node) => {
    filterFunctions.forEach((filterMethod, index) => {
      const dToken = filterMethod(node, designTokenFunctions[index]);
      designTokens.push(dToken);
    });
  });
  return designTokens;
};

// These methods have to be passed in order
filterFunctions.push(colorFilter);
designTokenFunctions.push(colorDesignTokenizer);

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
      throw Error('Failed to parse figma url');
    });
  };

  //TODO - not decided which typography format to choose from -  styles OR figma layer / component
  // const typographyFilter = (data: NodeDocument, designTokenFilterFn: DesignTokenFilter): DesignToken => {
  //   console.log(data);
  //   if(data.type == 'TEXT') {
  //     data.type = 'typography';
  //   }
  //   const designToken = designTokenFilterFn(data);
  //   return designToken;
  // };
 
  // GET 
  const getStyles = (fileKey: string): Promise<GetStylesListType> =>{
    return getData(`https://api.figma.com/v1/files/${ fileKey }/styles`).then(({ meta: { styles } }) => {
      const startingData: GetStylesListType = { nodes: [], styles: {} };
      return styles.reduce( (previousValue: GetStylesListType, currentStyle: StyleMetadata) => {
        if(previousValue.styles[currentStyle.node_id]) return previousValue;
        const styleKey: FigmaStyle = {};
        styleKey[currentStyle.node_id] = currentStyle;
        return { 
          styles: {
            ...previousValue.styles,
            ...styleKey
          }, 
          nodes: [...previousValue.nodes, currentStyle.node_id] 
        };
      }, startingData );
    });
  };

  const getNodes = (fileKey: string, nodeIds: string[])=> {
    console.log(fileKey);
    // TODO break the long node requests into small requests
    // https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIds.join(",")}
    return getData(`https://api.figma.com/v1/files/${ fileKey }/nodes?ids=${ nodeIds.join(',') }`)
      .then((data: FigmaFileNodes) => { return data.nodes;})
      .then((figmaFileNode) => flattenNodes(figmaFileNode));
  };

  const flattenNodes = (nodes: FigmaNodeKey): NodeDocument[] => {
    return Object.keys(nodes).map((key) => {
      return nodes[key].document;
    });
  };

  const processStyles = async (fileKey: string) => {
    const recoveredStyles = await getStyles(fileKey);
    const nodeIds = recoveredStyles.nodes;
    const nodes = await getNodes(fileKey, nodeIds);
    console.log(nodes);

    const designTokens = convertNodesToTokens(nodes);
    // // groups them all
    return groupByType(designTokens);
  };

  return {
    getData,
    getNodes,
    getStyles,
    processStyles
  };
};
