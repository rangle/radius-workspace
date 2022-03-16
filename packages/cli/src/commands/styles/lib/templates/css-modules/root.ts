import { mapKeys } from '../../../utils/common.utils';
import { DesignTokenGroup } from '../../../utils/figma.utils';
import { RenderTokenGroup, RenderTokenGroupFile } from '../types';
import { createTokenContext } from '../utils';
import { color, spacing, template } from './template';
import { template as typography } from './typography';
import { template as grid } from './grid';

const entries = mapKeys<DesignTokenGroup>([
	'color',
	'grid',
	'typography',
	'spacing'
]);

const rootTemplate: RenderTokenGroupFile = (tokenGroup) => {
	let content = '';
	entries(tokenGroup).forEach(([type]) => {
		content = content + `@import "./_${type}.css";\n`;
	});
	return ['./styles/index.css', content];
};

export const fileTemplates: RenderTokenGroup = (tokenGroup) => {
	const context = createTokenContext(tokenGroup);
	return [
		rootTemplate(tokenGroup),
		...entries(tokenGroup).map(([type, tokens]) => {
			switch (type) {
				case 'typography':
					return typography(tokens, type, context);
				case 'grid':
					return grid(tokens, type, context);
				case 'spacing':
					return spacing(tokens, type, context);
				case 'color':
					return color(tokens, type, context);
				default:
					return template(tokens, type, context);
			}
		})
	];
};
