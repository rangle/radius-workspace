import {
  generateColorsCSS,
  generateElevationCSS,
  generateGridCSS,
  generateSpacingCSS,
  generateTypographyCSS
} from './cssGenerator.utils';
import { DesignToken } from '../utils/figma.utils';

describe('CSS Generator', () => {
  it('should generate color variables with the right name and value', () => {
    const expectedOutput = '--ds-color--colour-text-success: #138000;';

    const designToken: DesignToken = {
      type: 'color',
      name: 'color css test',
      token: '-colour-text-success',
      value: '#138000'
    };

    expect(generateColorsCSS).toBeDefined();
    expect(generateColorsCSS(designToken)).toBe(expectedOutput);
  });

  it('should generate typography variables with the right name and value', () => {
    const designToken: DesignToken =
      {
        type: 'typography',
        name: 'typography css test',
        token: '-typography-label-font-family',
        value: 'Roboto'
      };

    const expectedOutput = '--ds-typography-label-font-family: Roboto;';

    expect(generateTypographyCSS).toBeDefined();
    expect(generateTypographyCSS(designToken)).toBe(expectedOutput);
  });

  it('should generate spacing variables with the right name and value', () => {
    const designToken: DesignToken =
      {
        type: 'spacing',
        name: 'spacing css test',
        token: '-space-1',
        value: '4'
      };

    const expectedOutput = '--ds-space-1: 0.25rem;';

    expect(generateSpacingCSS).toBeDefined();
    expect(generateSpacingCSS(designToken)).toBe(expectedOutput);
  });

  it('should generate elevation variables with the right name and value', () => {
    const designToken: DesignToken =
      {
        type: 'elevation',
        name: 'elevation css test',
        token: 'elevation-80',
        value: 'drop-shadow(0px 8px rgba(48 49 51 0.10)) drop-shadow(0px 0px rgba(48 49 51 0.05))'
      };

    const expectedOutput = '--ds-elevation-80: drop-shadow(0px 8px rgba(48 49 51 0.10)) ' +
      'drop-shadow(0px 0px rgba(48 49 51 0.05));';

    expect(generateElevationCSS).toBeDefined();
    expect(generateElevationCSS(designToken)).toBe(expectedOutput);
  });

  it('should generate grid variables with the right name and value', () => {
    const designToken: DesignToken =
      {
        type: 'grid',
        name: 'grid css test',
        token: '-grid-margin-l',
        value: '154'
      };

    const expectedOutput = '--ds-grid-margin-l: 154px;';

    expect(generateGridCSS).toBeDefined();
    expect(generateGridCSS(designToken)).toBe(expectedOutput);
  });
});