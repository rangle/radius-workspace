import { NodeDoc, NodeRoot } from './figma.utils';
import { 
  filterByColorStyleType, 
  filterByTypeFill, 
  filterByTypography, 
  generateStyleMap, getChildNodes, getChildStyleNodes } from './figmaParser.utils';

//Types
type FigmaTokenAnalyzer = (tree: NodeRoot) => boolean;
type FigmaTokenParser<T> = (tree: NodeRoot) => T[];
type FigmaTokenizer<T> = [FigmaTokenAnalyzer, FigmaTokenParser<T>];


type OptionType = 'color' | 'typography';
type FigObj<T> = {
  option: {
    [key in OptionType]: FigmaTokenizer<T>
  },
};
type FTokenizer<T> = FigObj<T>;

/* 
    VALIDATORS 
*/

//Typography
const isTypographyFormat1: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  return Object.entries(generateStyleMap(tree.componentSets, filterByTypography)).length > 0 ? true : false;
};

const isTypographyFormat2: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  return tree.document.name.includes('Typography');
};

//Colors
const isColor1: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  const styleMap = generateStyleMap(tree.styles, filterByTypeFill);
  console.log(styleMap);
  return Object.entries(styleMap).length > 1 ? true : false; 
};

const isColor2: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  return Object.entries(generateStyleMap(tree.styles, filterByColorStyleType)).length > 0 ? true : false;
};

const getColor1 = (tree: NodeRoot) => {
  const styleMap = generateStyleMap(tree.styles, filterByTypeFill);
  return getChildStyleNodes(tree.document as NodeDoc, false, styleMap, '');
};
  
const getColor2 = (tree: NodeRoot) => {
  return getChildNodes(tree.document as NodeDoc, []).filter((node) => node.name.includes('$color'));
};
  
/* 
    PARSERS 
*/
const getTypography1 = (tree: NodeRoot) => {
  return getChildStyleNodes(
    tree.document as NodeDoc,
    true,
    generateStyleMap(tree.componentSets, filterByTypography),
    ''
  ).flatMap((nodeDoc)=>{
    return nodeDoc.children.flatMap((child) => child.children.flatMap((typographyNode) => {
      typographyNode.parent = nodeDoc.name;
      return typographyNode;
    }));
  }) as NodeDoc[];
};

const getTypography2 = (tree: NodeRoot) => {
  return getChildNodes(tree.document as NodeDoc, [])
    .map((doc) => {
      doc.type ='typography'; 
      return doc; 
    })
    .filter((node) => node.name.includes('$'));
};

const generateParser = <T extends NodeDoc>(tokenizers: FigmaTokenizer<T>[]) => (tree: NodeRoot) => {
  const emptyMap = { EMPTY_TYPE: true };
  const data = tokenizers.find(([canParse]) => canParse(tree));
  const parse: FigmaTokenParser<T> = data?.[1] as FigmaTokenParser<T>;
  
  if(typeof parse === 'function') {
    return parse(tree);
  }
  return emptyMap;
};

const tokenOption: FigObj<NodeDoc> = {
  option: {
    'color': [isColor2, getColor2],
    'typography': [isTypographyFormat2, getTypography2]
  }
};

export const tokenSelector: FTokenizer<NodeDoc> = 
  tokenOption;

const parseColors = generateParser([
  [isColor1, getColor1],
  [isColor2, getColor2]
]);

const parseTypography = generateParser([
  [isTypographyFormat1, getTypography1],
  [isTypographyFormat2, getTypography2]
]); 

export const parser = {
  colors: parseColors,
  typography: parseTypography
};

export const figmaResolver = {
  withOptions: {
    colors: generateParser,
    typography: generateParser
  },
  parser: {
    colors: parseColors,
    typography: parseTypography
  }
};

// loader configuration
// validator 
// different values from different applications... no frontify great
//

