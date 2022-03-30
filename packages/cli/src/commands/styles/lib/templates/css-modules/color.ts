import { RenderTokenFile, TOKEN_FILE_COMMENTS } from '../types';
import { generateColorsCSS } from '../../../utils/cssGenerator.utils';

export const color: RenderTokenFile = (tokens, type) =>
  [
    `./styles/_${ type }.css`,
    `:root {
${ TOKEN_FILE_COMMENTS[type] }

${ tokens.map(( token ) => `${ generateColorsCSS(token) }`).join('\n') }

}`
  ] as const;