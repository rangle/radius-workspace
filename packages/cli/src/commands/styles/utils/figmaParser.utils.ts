import { 
  ColorStyle,
  DesignToken, 
  ElevationStyle, 
  NodeDef, 
  NodeDoc, 
  NodeDocument, 
  RectangleNode, 
  StyleDef, 
  TypographyStyle 
} from './figma.utils';

export type NodeKey<T extends NodeDef> = {
  [key: string]: T,
};

const FigmaTypes = {
  FILL: 'FILL',
  GRID: 'GRID',
  SPACER: 'Spacer',
  TYPOGRAPHY: 'TEXT',
  ELEVATION: 'Shadows'
} as const;


export type TokenTransformWithStyle<T extends NodeDocument> = (a: T, style: NodeDef) => DesignToken[];
export type TokenTransformWithoutStyle<T extends NodeDocument> = (a: T) => DesignToken[];
export type TokenTransformWithSpacing<R extends RectangleNode> = (a: R) => DesignToken[];
export type TokenTransform<T extends NodeDoc> = TokenTransformWithStyle<T> | TokenTransformWithoutStyle<T>;

export const filterByTypeFill = (data: StyleDef): boolean => {
  return (
    data.styleType === FigmaTypes.FILL && data.description.includes('Token')
  );
};

export const filterByTypeGrid = (data: StyleDef): boolean => {
  return data.styleType === FigmaTypes.GRID;
};

export const filterByDescriptionSpacer = (data: NodeDef): boolean => {
  return data.description.includes(FigmaTypes.SPACER);
};

export const filterByTypography = (data: StyleDef): boolean =>{
  return data.styleType === FigmaTypes.TYPOGRAPHY;
};   

export const filterByElevation = (data: NodeDef): boolean => {
  return data.description.includes(FigmaTypes.ELEVATION);
};

export const generateStyleMap = <T extends NodeDef>(nodeKeys: NodeKey<T>, fn: (data: T) => boolean): NodeKey<T> => {
  const filtered = Object.keys(nodeKeys)
    .map((style)=> {return style;})
    .filter((k)=> fn(nodeKeys[k]))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: nodeKeys[key]
      };
    }, {});     
  return filtered;
};

export const getChildStyleNodes = <S extends string, U extends NodeDef, T extends NodeDoc>
( nodeDocument: T, 
  isComponent=false, 
  nodeKeys: NodeKey<U>, 
  keyDef: S
): NodeDoc[] => {
  let childNodes: NodeDoc[] = [];
  if(nodeKeys[keyDef]) {
    return [nodeDocument]; 
  }  

  if(nodeDocument.children){
    //Cast as NodeDoc[] for spacing tokens that have a rectangle bounding box 
    const nodeChildren = nodeDocument.children as NodeDoc[];
    childNodes = nodeChildren.flatMap((node) => { 

      let nodeStyle = '';
      if(isComponent) {
        nodeStyle = node.id;
      } else {
        nodeStyle = getStyle(node.styles);
        // Commented out Type guard for previous styles format that did not include elevations.effect
        // nodeStyle = isTypographyStyle(node.styles) ? node.styles?.text : node.styles?.fill;
      }
      return getChildStyleNodes(node, isComponent, nodeKeys, nodeStyle);
    });
  }   
  return childNodes;   
}; 


const getStyle = (style: ColorStyle | TypographyStyle | ElevationStyle )  => {
  if(style == undefined) {
    return '';
  }

  if('effect' in style) {
    return style.effect;
  } else if ('text' in style) {
    return style.text;
  } else if ('fill' in style) {
    return style.fill;
  } else {
    return '';
  }  
};

const isTypographyStyle = (o: NodeDocument['styles']): o is TypographyStyle =>
  !!o && !!(o as TypographyStyle).text;


/* Type narrowing example */
    
// const isTypoStyle = (style: TypographyStyle | ColorStyle): style is TypographyStyle => {
//     return(style as TypographyStyle).text !==undefined;
// }

export const generateDesignTokens = <T extends NodeDoc, U extends NodeDef>
( nodeKeys: NodeKey<U>, 
  node: T, 
  fn: TokenTransform<T>): DesignToken[] => {
    
  const nodeStyle = isTypographyStyle(node.styles) 
    ? node.styles?.text 
    : node.styles?.fill;

  return isTokenTransformWithoutStyle(fn) ? fn(node) : fn(node, nodeKeys[nodeStyle]);
};

//Checks whether argument length of either TokenTransformWithoutStyle or TokenStransformWithStyle is 1 or greater 
//This allows us to pass a function to generateDesignTokens with either one or two args.
export const isTokenTransformWithoutStyle = <T extends NodeDoc>
(f: TokenTransform<T>): f is TokenTransformWithoutStyle<T> => {
  return f.length === 1;
};


