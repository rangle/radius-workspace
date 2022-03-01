import { RenderTokenFile } from "../types";
import { filterTokenByViewPort } from "../utils";

export const template: RenderTokenFile = (tokens, _type, { breakpoints }) => {
  const queries = Object.keys(breakpoints).map((k) => ({
    viewPort: k,
    value: breakpoints[k],
  }));
  return [
    "./styles/_grid.css",
    `
  /* default grid tokens */

  :root {
${tokens
  .filter(({ viewPort }) => viewPort === "l")
  .map(
    ({ token, value, viewPort }) => `  ${token}: ${value}; /* ${viewPort} */ `
  )
  .join("\n")}
    
  }
  ${queries.map(({ viewPort, value }) => {
    return `
    /* grid tokens for ${viewPort} (${value}) */
    @media screen and (min-width: ${value}) {
        :root {
${filterTokenByViewPort(viewPort as "l" | "s" | "m", tokens)
  .map(
    ({ token, value, viewPort }) =>
      `          ${token}: ${value}; /* ${viewPort} */ `
  )
  .join("\n")}        
        }
    }`;
  })}
  `,
  ] as const;
};
