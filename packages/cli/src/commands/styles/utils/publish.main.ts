//validator //loader/parse //tokenizer
import axios from 'axios';
import { StyleMetadata } from 'figma-api/lib/api-types';
import { DesignToken, processTypographyToken } from './figma.utils';
import { groupBy } from './common.utils';
// const figmaToken = '379431-5a32d6d8-85b0-4193-b06b-841b89dcf741';
export type StyleResponse = {
  meta: {
    styles: StyleDescriptor[],
  },
};
type StyleDescriptor = {
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

export const getFileKey = (url: string) => {
  const fileKey = url.match(/\/file\/(\w*)\//);
  if(fileKey && fileKey.length > 1) return fileKey[1];
  throw Error('Could not find the file URL in the figma file');
};

export const generateToken = (name: string) => {
  return `--${ name.toLowerCase().split('/').join('-') }`;
};

const hex = (n: number) => `00${ n.toString(16) }`.slice(-2);
export const colorToHex = ({ r, g, b }: any) =>
  `#${ [r, g, b]
    .map((rValue) => rValue * 255)
    .map(Math.round)
    .map(hex)
    .join('') }`;


export const parseType = (style: any,target: any) => {
  let out: DesignToken | DesignToken[] = {
    type: 'typography',
    name: target.name,
    token: generateToken(target.name),
    value: 'default'
  };

  switch(style.style_type) {
    case 'FILL':
      out.type = 'color';
      out.value = colorToHex(target.fills?.[0].color);
      break;
    case 'GRID':
      out.type = 'breakpoint';
      break;
    case 'TEXT':
      out = processTypographyToken(target,style);
      break;
    case 'EFFECT':
      // Shadows
      // code
      break;
    default:
      // code block
  }
  return out;
};

export const figmaAPIFactory = (token: string) => {
  const getData = (urlInput: string) => {
    return axios.get(urlInput, {
      headers: {
        'X-FIGMA-TOKEN': token
      }
    }).then((res) => {
      // for saving mock data for testing
      // import fs from 'fs';
      // fs.writeFile(`${ new Date().getTime() }.json`, JSON.stringify({ data:res.data }),{},()=>{console.log(urlInput);});
      return res.data;
    });
  };

  const getStyles = (fileKey: string): Promise<GetStylesListType> =>{
    return getData(`https://api.figma.com/v1/files/${ fileKey }/styles`).then(({ meta: { styles } }) => {
      const startingData: GetStylesListType = { nodes: [], styles: {} };
      return styles.reduce( (previousValue: any, currentValue: StyleMetadata) => {
        if(previousValue.styles[currentValue.node_id]) return previousValue;
        const newValue: { [key: string]: StyleMetadata } = {};
        newValue[currentValue.node_id] = currentValue;
        return { 
          styles: {
            ...previousValue.styles,
            ...newValue
          }, 
          nodes: [...previousValue.nodes, currentValue.node_id] 
        };
      }, startingData );
    });
  };

  const getStyleNodes = (fileKey: string, nodeIds: string[]) => {
    return getData(`https://api.figma.com/v1/files/${ fileKey }/nodes?ids=${ nodeIds.join(',') }`)
      .then(({ nodes }) => nodes);
  };

  const processStyles = async (fileKey: string) => {
    const recoveredStyles = await getStyles(fileKey);
    const styleNodes = await getStyleNodes(fileKey, recoveredStyles.nodes);

    const styles = recoveredStyles.nodes.reduce<DesignToken[]>((previousValue: DesignToken[], nodeId: string) => {
      const style = recoveredStyles.styles[nodeId];
      const document = styleNodes[nodeId].document;
      const generatedToken = parseType(style,document);
      if(Array.isArray(generatedToken)) previousValue = previousValue.concat(generatedToken);
      else if(generatedToken.value !== 'default') previousValue.push(generatedToken);
      return previousValue;
    },[] as DesignToken[]);
    
    // groups them all
    const grouped = groupBy(styles,'type');
    return grouped;
  };

  return {
    getData,
    getStyles,
    getStyleNodes,
    processStyles
  };
};
