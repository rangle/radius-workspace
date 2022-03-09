import { BaseDef, ComponentDef, StyleDef } from "./figma.utils";

type NodeKey = {
    [key:string]: BaseDef
}

enum FigmaType {
    FILL = 'FILL',
    GRID = 'GRID',
    SPACER = 'Spacer'
}

export const filterByTypeFill = (data: StyleDef): boolean => {
    return data.styleType === FigmaType.FILL
}

export const filterByTypeGrid = (data: StyleDef): boolean => {
    return data.styleType === FigmaType.GRID
}

export const filterByDescriptionSpacer = (data: ComponentDef): boolean => {
    return data.description.includes(FigmaType.SPACER);
}

export const generateStyleTokens = (nodeKeys: NodeKey, fn: (data: BaseDef)=> boolean): NodeKey => {
     const filtered = Object.keys(nodeKeys)
        .map((style)=> {return style})
        .filter((k)=> fn(nodeKeys[k]))
        .reduce((obj, key) => {
            return {
                ...obj,
                [key]: nodeKeys[key]
            }
          }, {});     
    return filtered;
}