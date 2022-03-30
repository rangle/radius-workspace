import { generateColorsCSS, generateTypographyCSS } from './cssGenerator.utils';
import { DesignToken } from '../utils/figma.utils';

describe('CSS Generator', () => {
  it('should generate color variables with the right name', () => {
    const expectedOutput = '--ds-color-text-success: #138000;';

    const designToken: DesignToken = {
      type: 'color',
      name: 'color css test',
      token: '--colour-text-success',
      value: '#138000'
    };

    expect(generateColorsCSS).toBeDefined();
    expect(generateColorsCSS(designToken)).toBe(expectedOutput);
  });

  it('should generate typography variables with the right name', () => {
    const designToken: DesignToken =
      {
        type: 'typography',
        name: 'typography css test',
        token: '--typography-label-font-family',
        value: 'Roboto'
      };

    const expectedOutput ='--ds-typography-label-font-family: Roboto;';

    expect(generateTypographyCSS).toBeDefined();
    expect(generateTypographyCSS(designToken)).toBe(expectedOutput);
  });
});