import { DesignTokenGroup } from "../../../utils/figma.utils";

export type FileTemplate = readonly [fileName: string, content: string];

export const fileTemplates = <G extends DesignTokenGroup>(
    tokenGroup: G,
): FileTemplate[] => tokenGroup && [["x", "not implemented"]];
