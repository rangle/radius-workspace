import { DesignToken } from '../../../utils/figma.utils';
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

//TODO: refactor to make it easier to read
export const fileTemplates = (designTokens: DesignToken[]): FileTemplate[] => {
  const tokensOut: TokensAsJson = {};

  designTokens.forEach((designToken) => {
    const token = designToken.token ? designToken.token : 'no token';
    const key = setToken(token);
    const value = setValue(designToken);
    
    tokensOut[designToken.type] == undefined
      ? (tokensOut[designToken.type] = {}, tokensOut[designToken.type][key] = value)
      : tokensOut[designToken.type][key] = value;
  });
 
  return [['styledTokens.json', JSON.stringify(tokensOut)]];
};
