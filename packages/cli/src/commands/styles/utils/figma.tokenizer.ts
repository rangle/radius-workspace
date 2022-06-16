import { colorToHex, NodeDocument, DesignToken,  Color, processTypographyDesignToken, NodeDoc } from './figma.utils';
// import { DesignToken, , FigmaFileNodes, NodeDocument, FigmaNodeKey,Styles } from './figma.utils';
import { LayoutGrid } from 'figma-api/lib/ast-types';


export const tokenizeName = (text: string) => {
  const out = text.toString().replace(/[A-Z]/g, (newText: string) => '-' + newText.toLowerCase())
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+/, '-')
    .replace(/-+$/, '-');
  if(out.charAt(0) === '-') return out.substring(1);
  return out;
};


export const colorDesignTokenizer = (node: NodeDocument): DesignToken => {
  const colorToken: DesignToken = {
    type: 'color' ,
    name: node.name,
    node_id: node.id,
    value: colorToHex(node.fills[0].color)
  };
  return colorToken;
};

export const processElevationTokenizer = (nodeDoc: NodeDocument): DesignToken[] => {
  const { name, effects } = nodeDoc;
  if(!effects) return [];

  const token = name.toLowerCase().split('/').filter((item) => item !== 'light').join('-').replace('%','');

  const rgbMap = effects.map((effect) =>  {
    const objKeys = Object.keys(effect.color)as Array<keyof Color>;
    return objKeys
      .map((_key) => {
        if(_key == 'a') {
          return effect.color[_key].toFixed(2);
        }
        return Math.round(effect.color[_key]*255);
      }).join(', ');
  });
  
  const offsetMap = effects.map((effect)=> {
    const offsetKeys = Object.keys(effect.offset) as Array<keyof { x: number, y: number }>;
    const shadowValues = offsetKeys.map((_key) => {
      return effect.offset[_key] + 'px ';
    }).join('');
    return shadowValues.concat(`${ effect.radius.toString() }px`);
  });
  
  const tokenMap = Object.keys(rgbMap).map((_key, index) => {
    if(offsetMap[index]) {
      return `${ offsetMap[index] } rgba(${ rgbMap[index] })`;
    }
  });
  
  return [{
    type: 'elevation',
    name: `${ name }`,
    token: `${ token }`,
    value: tokenMap.join(', ')
  }] as DesignToken[];
};


export const typographyTokenizer = (nodeDoc: NodeDocument): DesignToken[] => {
  const typographyTokens: DesignToken[] = [];
  for(const style in nodeDoc.style){
    typographyTokens.push(processTypographyDesignToken(nodeDoc as NodeDoc,style)); 
  }
  return typographyTokens;
};

export const gridTokenizer = (nodeDoc: NodeDocument): DesignToken[] => {
  const designTokens: DesignToken[] = [];

  if(!nodeDoc.layoutGrids || nodeDoc.layoutGrids.length === 0) return designTokens;

  let layout: LayoutGrid|undefined = undefined;//nodeDoc.layoutGrids[0];

  // there can be multiple layouts
  // but most likely this the first one, with these properties should work
  layout = nodeDoc.layoutGrids.filter((layoutGrid: LayoutGrid)=> {
    return layoutGrid && layoutGrid.pattern === 'COLUMNS' && layoutGrid.count > 1;
  })[0];

  if(layout === undefined) return designTokens;
  

  // if the name has px in it, it's probably the breakpoint
  if(nodeDoc.name.includes('px')){
    const matched = nodeDoc.name.match(/([0-9]*)px/m);
    if(matched && matched.length >= 2) {
      designTokens.push({
        type:'breakpoint',
        name: `${ nodeDoc.name }`,
        node_id: nodeDoc.id,
        value: `${ matched[1] }`
      } as DesignToken);
    }
  }

  // TODO: this is not actaully the column width - IDK what it actually is
  // This is usually a negative number
  // // /** Width of column grid or height of row grid or square grid spacing */
  // designTokens.push({
  //   type:'grid',
  //   name: `${ nodeDoc.name } column size`,
  //   node_id: nodeDoc.id,
  //   value: `${ layout.sectionSize }`
  // } as DesignToken);
  

  /** Spacing before the first column or row */
  designTokens.push({
    type:'grid',
    name: `${ nodeDoc.name } margin`,
    node_id: nodeDoc.id,
    value: `${ layout.offset }px`
  } as DesignToken);

  // /** Spacing in between columns and rows */
  designTokens.push({
    type:'grid',
    name: `${ nodeDoc.name } gutter`,
    node_id: nodeDoc.id,
    value: `${ layout.gutterSize }px`
  } as DesignToken);

  // /** Number of columns or rows */
  designTokens.push({
    type:'grid',
    name: `${ nodeDoc.name } count`,
    node_id: nodeDoc.id,
    value: `${ layout.count }`
  } as DesignToken);

  return designTokens;
};



export const spacingTokenizer = (node: NodeDocument): DesignToken|undefined => {
  const spacingToken: DesignToken = {
    type: 'spacing' ,
    name: node.name,
    node_id: node.id,
    value: '0'
  };
  
  const width = node?.absoluteBoundingBox ?
    node.absoluteBoundingBox.width : node.children[0]?.absoluteBoundingBox?.width;
  if(width) spacingToken.value = `${ width }`;
  
  return spacingToken;
};

export const buttonTokenizer = (node: NodeDocument): DesignToken|undefined => {
  const spacingToken: DesignToken = {
    type: 'spacing' ,
    name: node.name,
    node_id: node.id,
    value: '0'
  };
  
  const width = node?.absoluteBoundingBox ?
    node.absoluteBoundingBox.width : node.children[0]?.absoluteBoundingBox?.width;
  if(width) spacingToken.value = `${ width }`;
  
  return spacingToken;
};

