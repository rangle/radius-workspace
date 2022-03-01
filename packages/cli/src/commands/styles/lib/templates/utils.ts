import { DesignToken, DesignTokenGroup } from "../../utils/figma.utils";
import { TokenContext } from "./types";

export const createTokenContext = (
  tokenGroup: DesignTokenGroup
): TokenContext => {
  const { breakpoint } = tokenGroup;
  const breakpoints = breakpoint.reduce((res, item) => {
    return {
      ...res,
      [item.viewPort || "default"]: `${item.value}px`,
    };
  }, {});
  return { breakpoints };
};

const viewPortOrder = ["s", "m", "l"] as const;

export const filterTokenByViewPort = (
  sz: "s" | "m" | "l",
  list: DesignToken[]
) => {
  const startAt = viewPortOrder.indexOf(sz);
  return viewPortOrder
    .slice(startAt)
    .map((vp) => list.filter(({ viewPort }) => viewPort === vp))
    .reverse()
    .flatMap((x) => x);
};
