import { generateTypographyCSS } from '../../utils/cssGenerator.utils';
import { DesignToken, DesignTokenGroup } from '../../utils/figma.utils';
import { TokenContext, TYPOGRAPHY_FILE_COMMENTS } from './types';

export const createTokenContext = (
  tokenGroup: DesignTokenGroup
): TokenContext => {
  const { breakpoint } = tokenGroup;
  const breakpoints = breakpoint.reduce((res, item) => {
    return {
      ...res,
      [item.viewPort || 'default']: `${ item.value }px`
    };
  }, {});
  return { breakpoints };
};

const viewPortOrder = ['s', 'm', 'l'] as const;

export const filterTokenByViewPort = (
  sz: 's' | 'm' | 'l',
  list: DesignToken[]
) => {
  const startAt = viewPortOrder.indexOf(sz);
  return viewPortOrder
    .slice(startAt)
    .map((vp) => list.filter(({ viewPort }) => viewPort === vp))
    .reverse()
    .flatMap((x) => x);
};

export type typographyMap = {
  [key: string]: DesignToken[],
};

const extractFontBody = (tokens: DesignToken[], filterType: string, typographyCommentKey: string): string => {
  return tokens.filter((token) => token.name.includes(filterType)).map((token, index)=> {
    if(index ==0) {
      return `\n${ TYPOGRAPHY_FILE_COMMENTS[typographyCommentKey as keyof typeof TYPOGRAPHY_FILE_COMMENTS] }\n
       ${ generateTypographyCSS(token) }`; 
    }
    return `${ generateTypographyCSS(token) }`;
  } ).join('\n');
};

export const generateTypographyTokenBody = (tokens: DesignToken[]): string => {
  const scale = extractFontBody(tokens, 'Font scale', 'scale');
  const weight = extractFontBody(tokens, 'Font weight', 'weight');
  const spacing = extractFontBody(tokens, 'Letter spacing', 'spacing');
  const lineHeight = extractFontBody(tokens, 'Line height', 'lineHeight');

  return scale + weight + spacing + lineHeight;
};



