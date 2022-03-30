import { RenderTokenFile, TOKEN_FILE_COMMENTS } from '../types';
import { generateElevationCSS } from '../../../utils/cssGenerator.utils';

export const elevation: RenderTokenFile = (tokens, type) =>
  [
    `./styles/_${ type }.css`,
    `:root {
${ TOKEN_FILE_COMMENTS[type] }
${ tokens.map(( token ) => `${ generateElevationCSS(token) }`).join('\n') }
}`
  ] as const;