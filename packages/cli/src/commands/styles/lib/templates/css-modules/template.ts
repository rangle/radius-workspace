import { RenderTokenFile, TOKEN_FILE_COMMENTS } from '../types';

export const template: RenderTokenFile = (tokens, type) =>
  [
	    `./styles/_${ type }.css`,
	    `${ TOKEN_FILE_COMMENTS[type] }
    ${ tokens.map(({ token, value }) => `  ${ token }: ${ value };`).join('\n') }`
  ] as const;
