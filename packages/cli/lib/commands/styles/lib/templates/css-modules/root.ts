import { mapKeys } from "../../../utils/common.utils";
import { DesignTokenGroup } from "../../../utils/figma.utils";
import { RenderTokenGroup, RenderTokenGroupFile } from "../types";
import { createTokenContext } from "../utils";
import { template } from "./template";
import { template as typography } from "./typography";
import { template as grid } from "./grid";

const entries = mapKeys<DesignTokenGroup>([
  "color",
  "grid",
  "typography",
  "spacing",
]);

const rootTemplate: RenderTokenGroupFile = (tokenGroup) => [
  `./styles/theme.css`,
  `
  ${entries(tokenGroup).map(
    ([type]) => `
  @import url('./_${type}.css');`
  )}
  `,
];

export const fileTemplates: RenderTokenGroup = (tokenGroup) => {
  const context = createTokenContext(tokenGroup);
  return [
    rootTemplate(tokenGroup),
    ...entries(tokenGroup).map(([type, tokens]) =>
      type === "typography"
        ? typography(tokens, type, context)
        : type === "grid"
        ? grid(tokens, type, context)
        : template(tokens, type, context)
    ),
  ];
};
