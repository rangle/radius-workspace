import { GroupOf, toKebabCase } from './common.utils';
import {
  filterByDescriptionSpacer,
  filterByElevation,
  filterByTypeFill,
  filterByTypography,
  generateDesignTokens,
  generateStyleMap,
  getChildStyleNodes,
  NodeKey,
  TokenTransform
} from './figmaParser.utils';
import { LayoutGrid } from 'figma-api/lib/ast-types';
import { tokenizeName } from './figma.tokenizer';

const tokensV2Flag = true;

export type FigmaFileParams = {
  url: string,
  token: string,
};


// type Unpromise<T extends Promise<any>> = T extends Promise<infer X> ? X : never;
export type FigmaFileNodes = {
  nodes: {
    [key: string]: NodeRoot,
  },
};

export type FigmaNodeKey = {
  [key: string]: NodeRoot,
};

type NodeFrame = {
  id: string,
  type: 'FRAME',
  name: string,
  children: Array<NodeDocument>,
};

const isNodeFrame = (o: unknown): o is NodeFrame => {
  const { id, type, name, children } = (o as NodeFrame) || {};
  return (
    typeof id === 'string' &&
		typeof name === 'string' &&
		Array.isArray(children) &&
		type === 'FRAME'
  );
};

export type ColorStyle = {
  fill: string,
};

export type TypographyStyle = {
  text: string,
};

export type ElevationStyle = {
  effect: string,
};

export type CommonStyle = {
  s: string,
};

type TypographyStyleDetails = {
  fontFamily: string,
  fontWeight: number,
  fontSize: number,
  letterSpacing: number,
  lineHeightPx: number,
  lineHeightPercent: number,
  lineHeightPercentFontSize: number,
  fontPostScriptName?: string,
  textAutoResize?: string,
  textDecoration?: string,
  textAlignHorizontal?: string,
  textAlignVertical?: string,
  lineHeightUnit?: string,
};

export type NodeDocument = {
  id: string,
  type: string,
  name: string,
  parent: string,
  style: TypographyStyleDetails,
  blendMode?: string,
  strokes?: string[],
  strokeWeight?: number,
  strokeAlign?: string,
  effects?: EffectType[],
  fills: Array<{
    blendMode?: string,
    type?: string,
    color: {
      r: number,
      g: number,
      b: number,
    },
  }>,
  styles: ColorStyle | TypographyStyle,
  children: Array<NodeDocument>,
  absoluteBoundingBox?: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  layoutGrids?: LayoutGrid[],
};


export type Styles = ColorStyle | TypographyStyle | ElevationStyle;


export type BaseDef = {
  key: string,
  name: string,
  styleType: string,
  description: string,
};

export type StyleDef = BaseDef & {};

export type ComponentDef = Omit<StyleDef, 'styleType'> & {
  componentSetId: string,
};

export type NodeDef = StyleDef | ComponentDef;

export type NodeRoot = {
  document: NodeDocument,
  styles: {
    [key: string]: StyleDef,
  },
  components: {
    [key: string]: ComponentDef,
  },
  componentSets: {
    [key: string]: BaseDef,
  },
};

export type ColorToken = {
  name: string,
  token: string,
  color: {
    r: number,
    g: number,
    b: number,
  },
};

export type RectangleNode = NodeDocument & {
  absoluteBoundingBox: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  constraints: { 
    vertical: string, 
    horizontal: string, 
  },
};

// TODO
export type EffectsNode =  NodeDocument & {
  effects: EffectType[],
};

export type Color = {
  r: number,
  g: number,
  b: number,
  a: number,
};

type EffectType = {
  type: string,
  visible: boolean,
  color: {
    r: number,
    g: number,
    b: number,
    a: number,
  },
  blendMode: string,
  offset: {
    x: number,
    y: number,
  },
  radius: number,
  showShadowBehindNode: boolean,
};

export type NodeDoc = EffectsNode & RectangleNode & NodeDocument & {};

export type DesignToken = {
  type: 'typography' | 'color' | 'spacing' | 'breakpoint' | 'grid' | 'elevation',
  name: string,
  viewPort?: string,
  cascade?: boolean,
  token: string,
  value: string,
  unit?: 'px'|'em'|'rem'|'variable',
  node_id?: string,
};

export type DesignTokenGroup = GroupOf<DesignToken, 'type'>;

export const extractFirstNode = <T extends FigmaFileNodes>({ nodes }: T) =>
  Object.keys(nodes)
    .map((nodeId) => nodes[nodeId as keyof typeof nodes])
    .shift();

const isNodeRoot = (o: unknown): o is NodeRoot => !!(o as NodeRoot).document;

const recurseToFindFrames = <T extends NodeDocument | NodeRoot>(
  node: T
): NodeFrame[] => {
  if (isNodeFrame(node)) return [node];
  if (isNodeRoot(node)) return recurseToFindFrames(node.document);
  const children = node.children?.flatMap(recurseToFindFrames) || [];
  return children.filter(isNodeFrame);
};

const isRectangleNode = (o: NodeDocument): o is RectangleNode =>
  (o as RectangleNode).absoluteBoundingBox &&
	typeof (o as RectangleNode).absoluteBoundingBox.width === 'number';

const isColorStyle = (o: NodeDocument['styles']): o is ColorStyle =>
  !!o && !!(o as ColorStyle).fill;

const isTypographyStyle = (o: NodeDocument['styles']): o is TypographyStyle =>
  !!o && !!(o as TypographyStyle).text;

const hex = (n: number) => `00${ n.toString(16) }`.slice(-2);

export const colorToHex = (colorToken: ColorToken['color']) =>
  `#${ [colorToken?.r, colorToken?.g, colorToken?.b]
    .map((rValue) => rValue * 255)
    .map(Math.round)
    .map(hex)
    .join('') }`;

export const getTokens = (data: any) =>
  Promise.resolve(data)
    .then((x) => {
      //console.log(">>>ALL_NODES", x);
      // writeFileSync(
      //   `${__dirname}/figma-file-${new Date().toISOString()}.json`,
      //   JSON.stringify(x, undefined, 2)
      // );
      return x;
    })
    .then(extractFirstNode)
    .then((x) => {
      //console.log(">>>FIRST_NODE", x);
      return x;
    })
    .then((node) => {
      if (!node) throw new Error('Could not find Node: Tokens not defined');

      //generateTokensV2(node) uses figmaParser.utils.ts to extract tokens
      if(tokensV2Flag){
        generateTokensV2(node);
      }

      const styleIndex = node.styles;
      const frames = recurseToFindFrames(node);

      if (!frames.length)
        throw new Error('Could not find Frame: Tokens not defined');
      // flatten all top-level GROUPS inside each frame
      const groups = frames
      // eslint-disable-next-line no-sequences
        .flatMap(({ children, name }) =>
        // console.log("FRAME", name),
          children.map((child) => ({ ...child, parent: name }))
        )
        .filter(
          ({ type, name }) =>
            type === 'GROUP' || (type === 'COMPONENT_SET' && name === 'spacer')
        );

      return groups.flatMap((group) => {
        // console.log("==>>> GROUP", group.name);

        return group.children.flatMap((item) => {
          const { type, styles } = item;

          if (
            type === 'GROUP' &&
						group.name === 'margins' &&
						isRectangleNode(group) &&
						isRectangleNode(item)
          ) {
            return [
              ...processRectangleSize(group, group.parent, 'breakpoint'),
              ...processRectangleSize(item, group.parent, 'grid', 'grid-margin')
            ];
          }

          if (
            type === 'COMPONENT' &&
						group.type === 'COMPONENT_SET' &&
						group.name === 'spacer' // TODO: ask design to better name this
          ) {
            const { children } = item;

            // SPACING TOKEN
            return children
              .filter(isRectangleNode)
              .flatMap(processSpacingToken);
          }

          if (
            type === 'RECTANGLE' &&
						isColorStyle(styles) &&
						styleIndex[styles.fill] &&
						styleIndex[styles.fill].description.match(/#[Tt]oken/)
          ) {
            // COLOR TOKEN
            return processColorToken(item);
          }
          // TODO: talk to Design to flatten these groups and find other ways to mark screen size.
          if (group.name.match(/Typography-Tokens/) && type === 'GROUP') {
            const { children } = item;
            return children.flatMap((childItem) => {
              if (
                childItem.type === 'TEXT' &&
								isTypographyStyle(childItem.styles) &&
								styleIndex[childItem.styles.text] &&
								styleIndex[childItem.styles.text].description.match(/#[Tt]oken/)
              )
                return processTypographyToken(
                  childItem,
                  styleIndex[childItem.styles.text]
                );
              return [];
            });
          }
          return [];
        });
      });
    });

const processSpacingToken = (item: RectangleNode): DesignToken => {
  const { name, absoluteBoundingBox } = item;
  const { width } = absoluteBoundingBox;
  const [tokenName] = name.split('-');
  const token = `--${ tokenName.toLowerCase().split('/').join('-').replace('=', '-') }`;
  //console.log("SPACING TOKEN", name, token, width);
  return {
    type: 'spacing',
    name,
    token,
    value: String(width)
  } as DesignToken;
};

const processSpacingNode= <T extends NodeDoc>(nodeDocument: T): DesignToken[] => {
  const recNode = nodeDocument as RectangleNode;
  return typeof(recNode as RectangleNode).absoluteBoundingBox.width ==='number' ? [processSpacingToken(recNode)] : [];
};

export const processElevationToken = <T extends NodeDoc>(nodeDoc: T): DesignToken[] => {
  const { name, effects } = nodeDoc;
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

// export const generateFigmaTypographyToken = <T extends NodeRectangle<'TEXT'>>(node: T) => {
//   console.log(node);
//   console.log(node.style);
// };

export const processTypographyToken = <T extends NodeDocument, S extends NodeDef>(
  item: T,
  style: S
): DesignToken[] => {
  const {
    name,
    style: {
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      lineHeightPercent
    }
  } = item;
    //console.log("TYPOGRAPHY TOKEN", name, style);
  const tokenIndex = {
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeightPercent
  };

  const [raw, viewPortName] = style.name.match(/>?([^/]*)$/) || [];
  const cascade = !!raw && raw.startsWith('>');
  const [, tokenName] =
		name.match(`(.*)/${ viewPortName }`) || ([undefined, name] as const);
  const tokens = Object.keys(tokenIndex).map(
    (key): DesignToken => ({
      type: 'typography',
      name: `${ tokenName }/${ key }`,
      viewPort: viewPortName[0] || 'default',
      cascade,
      token: `--${ tokenName.toLowerCase().split('/').join('-') }-${ toKebabCase(
        key
      ) }`,
      value: String(tokenIndex[key as keyof typeof tokenIndex])
    })
  );
  return tokens;
};


export const processCToken = <T extends NodeDocument>(item: T): DesignToken => {
  const { name, fills } = item;
  const [{ color }] = fills;
  //console.log("COLOR TOKEN RECTANGLE", name, color);
  const token = `--${ name.toLowerCase().split('/').join('-') }`;
  return {
    type: 'color',
    name,
    token,
    value: colorToHex(color)
  };
};

export const processColorToken = <T extends NodeDocument>(item: T): DesignToken[] => {
  const { name, fills } = item;
  const [{ color }] = fills;
  //console.log("COLOR TOKEN RECTANGLE", name, color);
  const token = `--${ name.toLowerCase().split('/').join('-') }`;
  return [
    {
		    type: 'color',
		    name,
		    token,
		    value: colorToHex(color)
    } as DesignToken
  ];
};


export function processRectangleSize(
  rectangle: RectangleNode,
  name: string,
  type: DesignToken['type'],
  prefix?: string
) {
  const { absoluteBoundingBox } = rectangle;
  const { width } = absoluteBoundingBox;
  const [sz, alias] = name.split('-');

  return [sz, alias].map((aliasValue) => {
    const token = `--${ [prefix ?? type, aliasValue].join('-') }`;
    // console.log(">>>> ", width, token);
    return {
      type,
      name,
      viewPort: sz,
      token,
      value: String(width)
    } as DesignToken;
  });
}

/*
  V2 Figma Api Parser
  Currently working for color, typography, and space tokens
  --note-- space tokens need to be formatted with correct prefix text
*/

//Check with Sean to see whats happening here <T extends NodeDoc>
//-> processFn: TokenTransform<NodeDocument>
const generateNodes =
  <U extends NodeDef>
  ( node: NodeRoot,
    isComponent=false,
    filter: (a: U) => boolean,
    processFn: TokenTransform<NodeDoc>
  ) => {
    const nodeKeys = (isComponent ? node.components : node.styles) as NodeKey<U>;

    const nodeDocument = node.document as NodeDoc;
    const styleMap = generateStyleMap(nodeKeys, filter);
    const flatNodes = getChildStyleNodes(nodeDocument, isComponent, styleMap, '');

    return flatNodes.flatMap((nodeDoc) => {
      return generateDesignTokens(styleMap, nodeDoc, processFn);
    });
  };

export const processTypographyDesignToken = (nodeDoc: NodeDoc, parent?: string): DesignToken => {
  parent = parent?.toLowerCase();
  if(parent?.includes('size')) {
    return {
      type: 'typography',
      name: `${ nodeDoc.name } Font scale`,
      value: `${ nodeDoc.style.fontSize.toString() }px`,
      token: tokenizeName(`--${ parent }${ nodeDoc.name }`)
    } as DesignToken;
  }

  if(parent?.includes('weight')) {
    return {
      type: 'typography',
      name: `${ nodeDoc.name } ${ parent } Font weight`,
      value: nodeDoc.style.fontWeight.toString(),
      token: tokenizeName(`--${ parent }${ nodeDoc.name }`)
    };
  }

  if(parent?.toLowerCase().includes('line') && parent?.toLowerCase().includes('percent')) {
    return {
      type: 'typography',
      name: `${ nodeDoc.name } Line height`,
      value: Math.round(nodeDoc.style.lineHeightPercentFontSize).toString() + '%',
      token: tokenizeName(`--${ parent }${ nodeDoc.name }`)
    };
  }

  if(parent?.toLowerCase().includes('spacing')) {
    return {
      type: 'typography',
      name: `${ nodeDoc.name } Letter spacing`,
      value:`${ (nodeDoc.style.letterSpacing / 16).toString() }em`,
      token: tokenizeName(`--${ parent }${ nodeDoc.name }`)
    };
  }
  return {} as DesignToken;
};

export const generateTypographyTokens = <T extends NodeDef>(
  node: NodeRoot,
  nodeKeys: NodeKey<T>,
  filterFn: (data: T) => boolean): DesignToken[] => {

  const typographyMap =  generateStyleMap(nodeKeys, filterFn);
  const typographyNodes = getChildStyleNodes(
    node.document as NodeDoc,
    true,
    typographyMap,
    ''
  ).flatMap((nodeDoc)=>{
    return nodeDoc.children.flatMap((child) => child.children.flatMap((typographyNode) => {
      typographyNode.parent = nodeDoc.name;
      return typographyNode;
    }));
  });

  return typographyNodes.map((tNode) => {
    return processTypographyDesignToken(tNode as NodeDoc, tNode.parent);
  }).filter((token) => token != undefined);
};

const generateTokensV2 = (node: NodeRoot): DesignToken[] => {
  const colorTokens = generateNodes(node, false, filterByTypeFill, processColorToken).
    filter((token) =>token.name.includes('colour'));
  const spaceTokens = generateNodes(node, true, filterByDescriptionSpacer, processSpacingNode);
  const elevationTokens = generateNodes(node, false, filterByElevation, processElevationToken);

  // TODO generateTypographyTokens needs to be refactored to use generateNodes() for better code readability
  // const typographyTokens = generateNodes(node, false, filterByTypography, processTypographyToken);
  const typographyTokens = generateTypographyTokens(node, node.componentSets, filterByTypography);

  // TODO Code below is required temporarily to generate tokens.
  // Current tokens require breakpoints to be passed as context type
  // Will be removed in the future
  const frames = recurseToFindFrames(node);

  if (!frames.length)
    throw new Error('Could not find Frame: Tokens not defined');
  // flatten all top-level GROUPS inside each frame
  const groups = frames
  // eslint-disable-next-line no-sequences
    .flatMap(({ children, name }) =>
    // console.log("FRAME", name),
      children.map((child) => ({ ...child, parent: name }))
    )
    .filter(
      ({ type }) =>
        type === 'GROUP'
    );

  const gridBreakpointTokens = groups.flatMap((group) => {
    return group.children.flatMap((item) => {
      if (
        item.type === 'GROUP' &&
        group.name === 'margins' &&
        isRectangleNode(group) &&
        isRectangleNode(item)
      ) {
        return [
          ...processRectangleSize(group, group.parent, 'breakpoint'),
          ...processRectangleSize(item, group.parent, 'grid', 'grid-margin')
        ];
      }}
    );
  }).filter((element) => element !== undefined) as DesignToken[];

  const tokens: DesignToken[] = [
    ...colorTokens,
    ...spaceTokens,
    ...elevationTokens,
    ...gridBreakpointTokens,
    ...typographyTokens];
  return tokens;
};
