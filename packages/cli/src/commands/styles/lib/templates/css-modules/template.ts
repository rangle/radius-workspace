import { RenderTokenFile, TOKEN_FILE_COMMENTS } from '../types';

export const template: RenderTokenFile = (tokens, type) =>
  [
	    `./styles/_${ type }.css`,
	    `${ TOKEN_FILE_COMMENTS[type] }
    ${ tokens.map(({ token, value }) => `  ${ token }: ${ value };`).join('\n') }`
  ] as const;

export const color: RenderTokenFile = (tokens, type) =>
  [
	    `./styles/_${ type }.css`,
	    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map(({ token, value }) => `  ${ token }: ${ value };`).join('\n') }
}`
  ] as const;

export const elevation: RenderTokenFile = (tokens, type) =>
  [
	    `./styles/_${ type }.css`,
	    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map(({ token, value }) => `  ${ token }: ${ value };`).join('\n') }
}`
  ] as const;

export const spacing: RenderTokenFile = (tokens, type) =>
  [
	    `./styles/_${ type }.css`,
	    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map(({ token, value }) => `  ${ token }: '${ value }px';`).join('\n') }
}`
  ] as const;
