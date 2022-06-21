import { 
  RenderTokenFile, 
  TOKEN_FILE_COMMENTS } from '../types';
import {
  generateColorsCSS,
  generateElevationCSS,
  generateSpacingCSS,
  generateGridCSS
} from '../../../utils/cssGenerator.utils';
  
//   generateTypographyCSS
import { generateTypographyTokenBody } from '../utils';
// filterTokenByViewPort, 
import { DesignToken } from '../../../utils/figma.utils';

const getCssValue = (token: DesignToken) => {
  if(token.unit === 'variable') return `  ${ token.token }: ${ token.value };`;
  return `  ${ token.token }: ${ token.value }${ token.unit?token.unit:'' };`;
};

export const template: RenderTokenFile = (tokens, type) =>
  [
	    `./_${ type }.css`,
	    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map((token) => getCssValue(token)).join('\n') }
}`
  ] as const;

// Color
export const color: RenderTokenFile = (tokens, type) =>
  [
    `./_${ type }.css`,
    `:root {
${ TOKEN_FILE_COMMENTS[type] }

${ tokens.map(( token ) => `${ generateColorsCSS(token) }`).join('\n') }

}`
  ] as const;

// Elevation

export const elevation: RenderTokenFile = (tokens, type) =>
  [
    `./_${ type }.css`,
    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map(( token ) => `${ generateElevationCSS(token) }`).join('\n') }
}`
  ] as const;

// Grid

export const grid: RenderTokenFile = (tokens, _type) => {
  // TODO current breakpoints fail if none are found  
  // const queries = Object.keys(breakpoints).map((k) => ({
  //   viewPort: k,
  //   value: breakpoints[k]
  // }));
  return [
    './_grid.css',
    `
  /* default grid tokens */

  :root {
${ tokens
    .filter(({ viewPort }) => viewPort === 'l')
    .map(
      (token) => `${ generateGridCSS(token) }`
    )
    .join('\n') }

  }
  ${ 
// TODO current breakpoints fail if none are found    
//     queries.map(({ viewPort, value }) => {
//     return `
//     /* grid tokens for ${ viewPort } (${ value }) */
//     @media screen and (min-width: ${ value }) {
//         :root {
// ${ filterTokenByViewPort(viewPort as 'l' | 's' | 'm', tokens)
//     .map(
//       (data: any) =>
//         `${ generateGridCSS(data) }`
//     )
//     .join('\n') }
//         }
//     }`;
//   }).join('') 
  '' }
  `
  ] as const;
};

// Spacing

export const spacing: RenderTokenFile = (tokens, type) =>
  [
    `./_${ type }.css`,
    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map(( token ) => `${ generateSpacingCSS(token) }`).join('\n') }
}`
  ] as const;

// Typography
export const typography: RenderTokenFile = (tokens, _type) => { 
  // TODO current breakpoints fail if none are found
  // console.log(breakpoints);
  // const queries = Object.keys(breakpoints).map((k) => ({
  //   viewPort: k,
  //   value: breakpoints[k]
  // }));
  return [
    './_typography.css',
    `
/* default typography tokens */
:root {
  ${ generateTypographyTokenBody(tokens) }
  ${ 
  // TODO current breakpoints fail if none are found   
  //   queries.map(({ viewPort, value }) => {
  //   return `
  //   /* typography tokens for ${ viewPort } (${ value }) */
  //   @media screen and (min-width: ${ value }) {
  //       :root {
  //       ${ filterTokenByViewPort(viewPort as 'l' | 's' | 'm', tokens)
  //   .map(
  //     (data: any) =>
  //       `  ${ generateTypographyCSS(data) }`
  //   )
  //   .join('\n') }
  //       }
  //   }`;
  // }).join('') 
  '' }

}`] as const;
};
