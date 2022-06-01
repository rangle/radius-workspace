import { NodeRoot, NodeDoc } from '../figma.utils';
import { 
  generateStyleMap, 
  filterByTypeFill, 
  getChildStyleNodes, 
  getChildNodes, 
  filterByTypography 
} from '../figmaParser.utils';

export const getColor1 = (tree: NodeRoot) => {
  const styleMap = generateStyleMap(tree.styles, filterByTypeFill);
  return getChildStyleNodes(tree.document as NodeDoc, false, styleMap, '');
};
    
export const getColor2 = (tree: NodeRoot) => {
  return getChildNodes(tree.document as NodeDoc, []).filter((node) => node.name.includes('$color'));
};

export const getTypography1 = (tree: NodeRoot) => {
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
  
export const getTypography2 = (tree: NodeRoot) => {
  return getChildNodes(tree.document as NodeDoc, [])
    .map((doc) => {
      doc.type ='typography'; 
      return doc; 
    })
    .filter((node) => node.name.includes('$'));
};