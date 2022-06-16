import { DesignTokenGroup, DesignToken } from '../../../utils/figma.utils';
import { camalize } from '../../../utils/figma.tokenizer';

export type FileTemplate = readonly [fileName: string, content: string];

type TokensAsJson = {
  [tokenType: string]: {
    [token: string]: string,
  },
};

const setValue = (designToken: DesignToken) => {
  if( designToken.unit === 'variable') return designToken.value;
  if( 
    !designToken.value.includes('px') && 
    !designToken.value.includes('rem') && 
    !designToken.value.includes('em') && 
    !designToken.value.includes('%') && 
    !designToken.value.includes('#') )
    return `${ designToken.value }px`;
  return designToken.value;
};

const setToken = (token: string) => {
  return camalize(token);
};

export const fileTemplates = (tokenGroups: DesignTokenGroup): FileTemplate[] => {
  const tokensOut: TokensAsJson = {};
  Object.keys(tokenGroups).forEach((tokenGroup: string)=>{
    const designTokens: DesignToken[] = tokenGroups[tokenGroup as keyof DesignTokenGroup];
    tokensOut[tokenGroup] = {};
    designTokens.forEach((designToken: DesignToken) => {
      const token = designToken.token?designToken.token:'no token';
      tokensOut[tokenGroup][setToken(token)] = setValue(designToken);
    });
  });
 
  return [['styledTokens.json', JSON.stringify(tokensOut)]];
};
