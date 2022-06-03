import { colorToHex, NodeDocument, DesignToken,  Color, processTypographyDesignToken, NodeDoc } from './figma.utils';
// import { DesignToken, , FigmaFileNodes, NodeDocument, FigmaNodeKey,Styles } from './figma.utils';

export const colorDesignTokenizer = (node: NodeDocument): DesignToken => {
  colorToHex(node.fills[0].color);
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
  const allTypeography: DesignToken[] = [];
  for(const style in nodeDoc.style){
    allTypeography.push(processTypographyDesignToken(nodeDoc as NodeDoc,style)); 
  }
  return allTypeography;
};