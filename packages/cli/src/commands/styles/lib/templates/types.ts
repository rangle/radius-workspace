import { DesignToken, DesignTokenGroup } from '../../utils/figma.utils';

export type FileTemplate = readonly [fileName: string, content: string];

export const TOKEN_FILE_COMMENTS: any = {
  spacing: `  /**
  * @tokens Spacing
  * @presenter Spacing
  */`,
  color: `  /**
  * @tokens Colors
  * @presenter Color
  */`,
  borders: `  /**
  * @tokens Border Radius
  * @presenter BorderRadius
  */`,
  shadow: `  /**
  * @tokens Shadow
  * @presenter Shadow
  */`,
  elevation: `  /**
  * @tokens Shadow
  * @presenter Shadow
  */`
};

export const TypographyTypes = {
  scale: 'Font scale',
  weight: 'Font weight',
  spacing: 'Letter spacing',
  lineHeight: 'Line height'
} as const;

export const TYPOGRAPHY_FILE_COMMENTS = {
  scale: `/**
  * @tokens Font Sizes
  * @presenter FontSize
  */`,
  weight: `/**
  * @tokens Font Weights
  * @presenter FontWeight
  */`,
  spacing: `/**
  * @tokens Letter Spacings
  * @presenter LetterSpacing
  */`,
  lineHeight: `/**
  * @tokens Line Heights
  * @presenter LineHeight
  */`

};

export type TokenContext = {
  breakpoints: {
    [k: string]: number,
  },
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
