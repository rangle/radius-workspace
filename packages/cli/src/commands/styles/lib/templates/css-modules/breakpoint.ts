import { RenderTokenFile, TOKEN_FILE_COMMENTS } from '../types';
import { generateBreakpointCSS } from '../../../utils/cssGenerator.utils';

export const spacing: RenderTokenFile = (tokens, type) =>
  [
    `./styles/_${ type }.css`,
    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map(( token ) => `${ generateBreakpointCSS(token) }`).join('\n') }
}`
  ] as const;