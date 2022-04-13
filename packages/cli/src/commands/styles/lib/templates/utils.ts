import { generateTypographyCSS } from '../../utils/cssGenerator.utils';
import { DesignToken, DesignTokenGroup } from '../../utils/figma.utils';
import { TokenContext, TypographyTypes, TYPOGRAPHY_FILE_COMMENTS } from './types';

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

export const generateTypographyTokenBody = (tokens: DesignToken[]): string => {
  const typographyMap: typographyMap = {};
  let typographyBody = '';

  Object.keys(TypographyTypes).map((key)=> {
    tokens.map((token) => {
      if(TypographyTypes[key as keyof typeof TypographyTypes] === token.name.trim()) {
        if(typographyMap[key]) {
          typographyMap[key].push(token);
        } else {
          //create new array if key doesnt already exist in map
          typographyMap[key] = [];
          typographyMap[key].push(token);
        }
      }
    });
  });

  Object.keys(typographyMap).forEach((key) => {
    const typographyBodyByKey = typographyMap[key].flatMap((token, index) => {
      //Only append Typography_File_Comments for the first element in the typography dictionary
      if(index == 0) {
        return `\n${ TYPOGRAPHY_FILE_COMMENTS[key] }\n ${ generateTypographyCSS(token) }`; 
      } else {
        return `${ generateTypographyCSS(token) }`;
      }
    }).join('\n');
    //appending string body of each typography group 
    typographyBody += typographyBodyByKey;
    return typographyBody;
  });
  return typographyBody;
};



