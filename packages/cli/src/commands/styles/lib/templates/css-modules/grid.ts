import { RenderTokenFile } from '../types';
import { filterTokenByViewPort } from '../utils';
import { generateGridCSS } from '../../../utils/cssGenerator.utils';

export const template: RenderTokenFile = (tokens, _type, { breakpoints }) => {
  const queries = Object.keys(breakpoints).map((k) => ({
    viewPort: k,
    value: breakpoints[k]
  }));
  return [
    './styles/_grid.css',
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
  ${ queries.map(({ viewPort, value }) => {
        return `
    /* grid tokens for ${ viewPort } (${ value }) */
    @media screen and (min-width: ${ value }) {
        :root {
${ filterTokenByViewPort(viewPort as 'l' | 's' | 'm', tokens)
          .map(
            (data: any) =>
              `${ generateGridCSS(data) }`
          )
          .join('\n') }
        }
    }`;
      }) }
  `
  ] as const;
};
