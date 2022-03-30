import { RenderTokenFile } from '../types';
import { filterTokenByViewPort } from '../utils';
import { generateTypographyCSS } from '../../../utils/cssGenerator.utils';

export const template: RenderTokenFile = (tokens, _type, { breakpoints }) => {
  const queries = Object.keys(breakpoints).map((k) => ({
    viewPort: k,
    value: breakpoints[k]
  }));
  return [
    './styles/_typography.css',
    `
  /* default typography tokens */

  :root {
      ${ tokens
      .map(
        ( token ) =>
          `  ${ generateTypographyCSS(token) }`
      )
      .join('\n') }

  }
  ${ queries.map(({ viewPort, value }) => {
        return `
    /* typography tokens for ${ viewPort } (${ value }) */
    @media screen and (min-width: ${ value }) {
        :root {
        ${ filterTokenByViewPort(viewPort as 'l' | 's' | 'm', tokens)
          .map(
            (data: any) =>
              `  ${ generateTypographyCSS(data) }`
          )
          .join('\n') }
        }
    }`;
      }) }
  `
  ] as const;
};
