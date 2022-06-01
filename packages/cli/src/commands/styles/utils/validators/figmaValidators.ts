/* 
    VALIDATORS 
*/

import { NodeRoot } from '../figma.utils';
import { filterByColorStyleType, filterByTypeFill, filterByTypography, generateStyleMap } from '../figmaParser.utils';
import { FigmaTokenAnalyzer } from '../figmaResolver.utils';

//Typography
export const isTypographyFormat1: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  return Object.entries(generateStyleMap(tree.componentSets, filterByTypography)).length > 0 ? true : false;
};
  
export const isTypographyFormat2: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  return tree.document.name.includes('Typography');
};
  
//Colors
export const isColor1: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  const styleMap = generateStyleMap(tree.styles, filterByTypeFill);
  return Object.entries(styleMap).length > 1 ? true : false; 
};
  
export const isColor2: FigmaTokenAnalyzer = (tree: NodeRoot) => {
  return Object.entries(generateStyleMap(tree.styles, filterByColorStyleType)).length > 0 ? true : false;
};