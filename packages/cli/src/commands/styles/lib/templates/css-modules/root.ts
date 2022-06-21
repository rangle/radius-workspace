import { mapKeys } from '../../../utils/common.utils';
import { DesignTokenGroup } from '../../../utils/figma.utils';
import { RenderTokenGroup, RenderTokenGroupFile } from '../types';
import { createTokenContext } from '../utils';
import { template, typography, spacing, color, elevation } from './template'; // grid,

const entries = mapKeys<DesignTokenGroup>([
  'color',
  'grid',
  'typography',
  'spacing',
  'elevation',
  'breakpoint'
]);

const rootTemplate: RenderTokenGroupFile = (tokenGroup) => {
  let content = '';
  Object.keys(tokenGroup).forEach((key: string) => {
    content = content + `@import "./_${ key }.css";\n`;
  });
  return ['./index.css', content];
};

export const fileTemplates: RenderTokenGroup = (tokenGroup) => {
  const context = createTokenContext(tokenGroup);
  return [
    rootTemplate(tokenGroup),
    ...entries(tokenGroup).filter(([_type, tokens])=>{
      if(tokens) return true;
      return false;
    }).map(([type, tokens]) => {
      switch (type) {
        case 'typography':
          return typography(tokens, type, context);
        case 'grid':
          // return grid(tokens, type, context);
          return template(tokens, type, context);
        case 'spacing':
          return spacing(tokens, type, context);
        case 'color':
          return color(tokens, type, context);
        case 'elevation':
          return elevation(tokens, type, context);
        default:
          return template(tokens, type, context);
      }
    })
  ];
};
