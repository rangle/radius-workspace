import { GetFileNodesResult } from 'figma-api/lib/api-types';
import { getColor2, getTypography2, getColor1, getTypography1 } from './extractors/figmaExtractors';
import { extractFirstNode, NodeDoc, NodeRoot } from './figma.utils';
import { isColor1, isColor2, isTypographyFormat1, isTypographyFormat2 } from './validators/figmaValidators';

//FigmaResolver Types
export type FigmaTokenAnalyzer = (tree: NodeRoot) => boolean;
export type FigmaTokenParser<T> = (tree: NodeRoot) => T[];
export type FigmaTokenizer<T> = [FigmaTokenAnalyzer, FigmaTokenParser<T>];


export type OptionType = 'color' | 'typography';
export type TokenOption<T> = {
  option: {
    [key in OptionType]: FigmaTokenizer<T>
  },
};

const generateParser = <T extends NodeDoc>(tokenizers: FigmaTokenizer<T>[]) => (tree: NodeRoot) => {
  const data = tokenizers?.find(([canParse]) => canParse(tree));
  const parse: FigmaTokenParser<T> = data?.[1] as FigmaTokenParser<T>;
  
  if(typeof parse === 'function') {
    return parse(tree);
  }
  return;
};

export const filterTokenOptions = <T extends TokenOption<NodeDoc>, U extends OptionType>
(tOption: T | undefined, key: U) => {
  return tOption?.option[key]? tOption.option[key] : undefined;
};

// type TokenOptionType = ((tree: NodeRoot) => NodeDoc[] | undefined)[];

export const isFigmaTokenParser = (tOption: FigmaTokenizer<NodeDoc> | undefined ) => {
  return (tOption as FigmaTokenizer<NodeDoc>)?.[1];
};

export const isFigmaTokenizerFunction = <T extends NodeDoc>(figmaTokenParser: FigmaTokenParser<T>) => {
  return typeof figmaTokenParser === 'function' ? true : false;
};

export const getTokenWithOptions = (tOption?: TokenOption<NodeDoc>): FigmaTokenParser<NodeDoc>[] => {
  
  const parserFunctions: FigmaTokenParser<NodeDoc>[] = [];

  const colors = isFigmaTokenParser(filterTokenOptions(tOption,'color'));
  if(isFigmaTokenizerFunction(colors)) parserFunctions.push(colors);

  const typography = isFigmaTokenParser(filterTokenOptions(tOption, 'typography'));
  if(isFigmaTokenizerFunction(typography)) parserFunctions.push(typography);
  return parserFunctions;
};

export const transformNodes = (data: GetFileNodesResult[]) => {
  return data.flatMap((node) => {
    const root: NodeRoot = extractFirstNode(node);
  
    // If getTokensWithOptions(tokenOptions) has param tokenOptions, execute lines 66-68
    const tokenOptionsFunctions = getTokenWithOptions();
    if (tokenOptionsFunctions.length) 
      return tokenOptionsFunctions.flatMap((fParser) => fParser(root));
  
    // If no tokenOptions provided, execute lines 72-76
    const colors = figmaResolver.parser.colors(root);
    if(colors?.length) return colors;
  
    const parsedTypography = figmaResolver.parser.typography(root);
    if(parsedTypography?.length) return parsedTypography;
  }).filter((node) => node);
};

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



