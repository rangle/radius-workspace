import { DesignToken, DesignTokenGroup } from "../../utils/figma.utils";

export type FileTemplate = readonly [fileName: string, content: string];

export type TokenContext = {
  breakpoints: {
    [k: string]: number;
  };
};

export type RenderTokenGroup = <G extends DesignTokenGroup>(
  tokenGroup: G
) => FileTemplate[];

export type RenderTokenGroupFile = <G extends DesignTokenGroup>(
  tokenGroup: G
) => FileTemplate;

export type RenderTokenFile = <T extends DesignToken>(
  tokens: T[],
  type: string,
  context: TokenContext
) => FileTemplate;
