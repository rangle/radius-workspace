import { RenderTokenFile } from "../types";

export const template: RenderTokenFile = (tokens, type) =>
  [
    `./styles/_${type}.css`,
    `
  /* ${type} tokens */
  :root {
${tokens.map(({ token, value }) => `  ${token}: ${value};`).join("\n")}
  }`,
  ] as const;
