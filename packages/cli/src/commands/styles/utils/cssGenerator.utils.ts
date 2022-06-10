import { DesignToken } from '../utils/figma.utils';
import { tokenizeName } from './figma.tokenizer';

export const generateColorsCSS = (designToken: DesignToken) => {
  if(!designToken.token) designToken.token = tokenizeName(designToken.name);
  const key = `--${ designToken.token }`;
  const value = designToken.value;
  return `${ key }: ${ value };`;
};

export const generateTypographyCSS = (designToken: DesignToken) => {
  if(!designToken.token) designToken.token = tokenizeName(designToken.name);
  const key = `--${ designToken.token }`;
  const value = designToken.value;
  return `${ key }: ${ value };`;
};

export const generateSpacingCSS = (designToken: DesignToken) => {
  if(!designToken.token) designToken.token = tokenizeName(designToken.name);
  const key = `--${ designToken.token }`;
  const value = designToken.value;
  const remValue = Number(value)/16 + 'rem';
  return `${ key }: ${ remValue };`;
};

export const generateElevationCSS = (designToken: DesignToken) => {
  if(!designToken.token) designToken.token = tokenizeName(designToken.name);
  const key = `--${ designToken.token }`;
  const value = designToken.value;
  return `${ key }: ${ value };`;
};

export const generateGridCSS = (designToken: DesignToken) => {
  if(!designToken.token) designToken.token = tokenizeName(designToken.name);
  const key = `--${ designToken.token }`;
  const value = designToken.value+ 'px';
  return `${ key }: ${ value };`;
};


