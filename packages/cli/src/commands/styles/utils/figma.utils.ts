import * as Figma from 'figma-api';
import { GroupOf, toKebabCase } from './common.utils';
// import { filterByDescriptionSpacer,
//          filterByTypeFill,
//          filterByTypography,
//          generateDesignTokens,
//          generateStyleMap,
//          getChildNodes,
//          getChildStyleNodes
//        } from "./figmaParser.utils";

export const setup = (key: string) => {
  const api = new Figma.Api({
    personalAccessToken: key
  });
  return {
    getFile: (fileKey: string) => api.getFile(fileKey),
    getFileNode: (fileKey: string, ids: string[]) =>
      api.getFileNodes(fileKey, ids)
  };
};

export type FigmaInputData = {
	url: string,
	token: string,
};

export type FigmaData = {
	fileId: string,
	nodeId: string,
	token: string,
};

export const assert = <T>(x: T, msg?: string) => {
  if (!x) throw new Error(msg || 'Assertion failed');
};

export function assertFigmaData(d: unknown): asserts d is FigmaData {
  const { fileId, nodeId, token } = (d as FigmaData) ?? {};
  assert(typeof fileId === 'string', 'fileId not found');
  assert(typeof nodeId === 'string', 'node-id not found');
  assert(typeof token === 'string', 'token not found');
}

export const processFigmaUrl = ({ url, token }: FigmaInputData): FigmaData => {
  const [, fileId] = url.match(/\/file\/(.*)\//) || [undefined];
  const [, encodedId] = url.match(/\?node-id=(.*)&?$/) || [undefined];
  const nodeId = encodedId && decodeURIComponent(encodedId);
  const data = { fileId, nodeId, token };
  assertFigmaData(data);
  return data;
};

// type Unpromise<T extends Promise<any>> = T extends Promise<infer X> ? X : never;
type FigmaFileNodes = {
	nodes: {
		[key: string]: NodeRoot,
	},
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
};

export type NodeDocument = {
	id: string,
	type: string,
	name: string,
	parent?: string,
	style: TypographyStyleDetails,
	fills: Array<{
		color: {
			r: number,
			g: number,
			b: number,
		},
	}>,
	styles: ColorStyle | TypographyStyle,
	children: Array<NodeDocument>,
};

export type BaseDef = {
	key: string,
	name: string,
	styleType: string,
	description: string,
};

export type StyleDef = BaseDef & {};

export type ComponentDef = Omit<StyleDef, 'styleType'>;

type NodeRoot = {
	document: NodeDocument,
	styles: {
		[key: string]: BaseDef,
	},
	components: {
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
};

export type DesignToken = {
	type: 'typography' | 'color' | 'spacing' | 'breakpoint' | 'grid',
	name: string,
	viewPort?: string,
	cascade?: boolean,
	token: string,
	value: string,
};

export type DesignTokenGroup = GroupOf<DesignToken, 'type'>;

const extractFirstNode = <T extends FigmaFileNodes>({ nodes }: T) =>
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

const colorToHex = ({ r, g, b }: ColorToken['color']) =>
  `#${ [r, g, b]
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
  const token = `--${ tokenName.toLowerCase().split('/').join('-') }`;
  //console.log("SPACING TOKEN", name, token, width);
  return {
    type: 'spacing',
    name,
    token,
    value: String(width)
  } as DesignToken;
};

export const processTypographyToken = (
  item: NodeDocument,
  style: StyleDef
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
    //console.log(tokens);
  return tokens;
};

const processColorToken = (item: NodeDocument): DesignToken[] => {
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
function processRectangleSize(
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

// const generateTokensV2 = (node: NodeRoot) => {
//   const colorMap = generateStyleMap(node.styles, filterByTypeFill);
//   const spaceMap = generateStyleMap(node.components, filterByDescriptionSpacer);
//   const typographyMap = generateStyleMap(node.styles, filterByTypography);

//   //Find matching node from figma api response body,
//   const flatSpaceNodes = getChildNodes(node.document, spaceMap, '');
//   const flatTypographyNodes = getChildStyleNodes(node.document, typographyMap, '');
//   const flatColorNodes = getChildStyleNodes(node.document, colorMap, '');

//   //Generate specific design tokens
//   const typographyTokens = flatTypographyNodes.flatMap(node => generateDesignTokens(typographyMap, node, processTypographyToken))
//   const colorTokens = flatColorNodes.flatMap(node => generateDesignTokens(colorMap, node, processColorToken))
//   const designSpaceTokens = flatSpaceNodes.filter(isRectangleNode).flatMap(processSpacingToken);
//   console.log(typographyTokens);
//   console.log(colorTokens);
//   console.log(designSpaceTokens);
// }
