import {
	BaseDef,
	ComponentDef,
	DesignToken,
	NodeDocument,
	StyleDef,
	TypographyStyle
} from './figma.utils';

type NodeKey = {
	[key: string]: BaseDef;
};

const FigmaTypes = {
	FILL: 'FILL',
	GRID: 'GRID',
	SPACER: 'Spacer',
	TYPOGRAPHY: 'Typography-Tokens'
} as const;

export const filterByTypeFill = (data: StyleDef): boolean => {
	return (
		data.styleType === FigmaTypes.FILL && data.description.includes('Token')
	);
};

export const filterByTypeGrid = (data: StyleDef): boolean => {
	return data.styleType === FigmaTypes.GRID;
};

export const filterByDescriptionSpacer = (data: ComponentDef): boolean => {
	return data.description.includes(FigmaTypes.SPACER);
};

export const filterByTypography = (data: StyleDef): boolean => {
	return data.description.includes(FigmaTypes.TYPOGRAPHY);
};
export const generateStyleMap = (
	nodeKeys: NodeKey,
	fn: (data: BaseDef) => boolean
): NodeKey => {
	const filtered = Object.keys(nodeKeys)
		.map((style) => {
			return style;
		})
		.filter((k) => fn(nodeKeys[k]))
		.reduce((obj, key) => {
			return {
				...obj,
				[key]: nodeKeys[key]
			};
		}, {});
	return filtered;
};

// var elements: NodeDocument[] = []
export const getChildren = (
	nodeDocument: NodeDocument,
	nodeKeys: NodeKey,
	result: NodeDocument[] = []
): NodeDocument[] => {
	if (nodeDocument.children) {
		nodeDocument.children.map((childDocument) => {
			if (nodeKeys[childDocument.id]) {
				result.push(childDocument);
			}
			getChildren(childDocument, nodeKeys, result);
		});
	}
	return result;
};

export const getChildNodes = <T extends string>(
	nodeDocument: NodeDocument,
	nodeKeys: NodeKey,
	keyDef: T
): any => {
	let childNodes: NodeDocument[] = [];
	if (nodeDocument.children) {
		if (nodeKeys[keyDef]) {
			return [nodeDocument];
		} else {
			childNodes = nodeDocument.children.flatMap((node) =>
				getChildNodes(node, nodeKeys, node.id)
			);
		}
	}
	return childNodes;
};

const isTypographyStyle = (o: NodeDocument['styles']): o is TypographyStyle =>
	!!o && !!(o as TypographyStyle).text;

export const getChildStyleNodes = <T extends string>(
	nodeDocument: NodeDocument,
	nodeKeys: NodeKey,
	keyDef: T
): NodeDocument[] => {
	let childNodes: NodeDocument[] = [];
	if (nodeKeys[keyDef]) {
		return [nodeDocument];
	}

	if (nodeDocument.children) {
		childNodes = nodeDocument.children.flatMap((node) => {
			const nodeStyle = isTypographyStyle(node.styles)
				? node.styles?.text
				: node.styles?.fill;
			return getChildStyleNodes(node, nodeKeys, nodeStyle);
		});
	}
	return childNodes;
};

type TokenTransformWithStyle<T extends NodeDocument> = (
	a: T,
	style: BaseDef
) => DesignToken[];
type TokenTransformWithoutStyle<T extends NodeDocument> = (
	a: T
) => DesignToken[];
type TokenTransform<T extends NodeDocument> =
	| TokenTransformWithStyle<T>
	| TokenTransformWithoutStyle<T>;

export const generateDesignTokens = <T extends NodeDocument>(
	nodeKeys: NodeKey,
	node: T,
	fn: TokenTransform<T>
): DesignToken[] => {
	const nodeStyle = isTypographyStyle(node.styles)
		? node.styles?.text
		: node.styles?.fill;

	return isTokenTransformWithoutStyle(fn)
		? fn(node)
		: fn(node, nodeKeys[nodeStyle]);
};

//Checks whether argument length of either TokenTransformWithoutStyle or TokenStransformWithStyle is 1 or greater
//This allows us to pass a function to generateDesignTokens with either one or two args.
const isTokenTransformWithoutStyle = <T extends NodeDocument>(
	f: TokenTransform<T>
): f is TokenTransformWithoutStyle<T> => {
	return f.length === 1;
};
