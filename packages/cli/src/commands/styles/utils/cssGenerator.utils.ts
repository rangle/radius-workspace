import { DesignToken } from '../utils/figma.utils';

export const generateColorsCSS = (designToken: DesignToken) => {
  const key = `--ds-color${ designToken.token.substring(8) }`;
  const value = designToken.value;
  return `${ key }: ${ value };`;
};

export const generateTypographyCSS = (designToken: DesignToken) => {
  const key = `--ds${ designToken.token.substring(1) }`;
  const value = designToken.value;
  return `${ key }: ${ value };`;
};

export const generateSpacingCSS = (designToken: DesignToken) => {
  const key = `--ds${ designToken.token.substring(1) }`;
  const value = designToken.value;
  const remValue = Number(value)/16 + 'rem';
  return `${ key }: ${ remValue };`;
};

export const generateElevationCSS = (designToken: DesignToken) => {
  const key = `--ds-${ designToken.token }`;
  const value = designToken.value;
  return `${ key }: ${ value };`;
};

export const generateGridCSS = (designToken: DesignToken) => {
  const key = `--ds${ designToken.token.substring(1) }`;
  const value = designToken.value+ 'px';
  return `${ key }: ${ value };`;
};
