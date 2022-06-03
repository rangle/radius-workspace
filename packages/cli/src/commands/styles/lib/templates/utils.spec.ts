// import { createTokenContext, filterTokenByViewPort, generateTypographyTokenBody } from './utils';
import { DesignToken, DesignTokenGroup } from '../../utils/figma.utils';
import { createTokenContext, filterTokenByViewPort, generateTypographyTokenBody } from './utils';


const exampleBreakPoinToken: DesignToken = {
  type:'breakpoint',
  name:'demo',
  token:'xxTokenxx',
  value:'50'
};
const exampleWideBreakPoinToken: DesignToken = {
  type:'breakpoint',
  name:'demo',
  token:'xxTokenxx',
  value:'100',
  viewPort:'l'
};

describe('Styles - Utils - createTokenContext', () => {
  const emptyDesignTokenGroup: DesignTokenGroup = { 
    typography:[], 
    color:[], 
    spacing:[], 
    breakpoint:[], 
    grid:[], 
    elevation:[] 
  };
  it('returns an empty breakpoints design token', async () => {
    const outcome = createTokenContext(emptyDesignTokenGroup);
    expect(outcome).toStrictEqual({ 'breakpoints': {} });
  });

  it('returns a default value of 50px and wide value of 100', async () => {

    const exampleDesignTokenGroup: DesignTokenGroup = { 
      typography:[], 
      color:[], 
      spacing:[], 
      breakpoint:[exampleBreakPoinToken,exampleWideBreakPoinToken], 
      grid:[], 
      elevation:[] 
    };
    const outcome = createTokenContext(exampleDesignTokenGroup);
    expect(outcome).toStrictEqual({ 'breakpoints': {
      default:'50px',
      l:'100px'
    } });
  });
});

describe('Styles - Utils - filterTokenByViewPort', () => {
  it('returns an emtpy array because no view ports were set', async () => {
    const outcome = filterTokenByViewPort('l',[exampleBreakPoinToken]);
    expect(outcome).toStrictEqual([]);
  });

  it('returns only the selected "l" view ports', async () => {
    const outcome = filterTokenByViewPort('l',[exampleBreakPoinToken,exampleWideBreakPoinToken]);
    expect(outcome).toStrictEqual([exampleWideBreakPoinToken]);
  });

});


const typographyScaleToken: DesignToken = {
  type:'typography',
  name:'Font scale',
  token:'scale',
  value:'50'
};

const typographyWeightToken: DesignToken = {
  type:'typography',
  name:'Font weight',
  token:'weight',
  value:'50'
};

describe('Styles - Utils - generateTypographyTokenBody', () => {
  it('with no input generate type returns an empty string', async () => {
    const outcome = generateTypographyTokenBody([]);
    expect(outcome).toStrictEqual('');
  });

  it('with scale generate scale size', async () => {
    const outcome = generateTypographyTokenBody([typographyScaleToken]);
    expect(outcome).toBe(`
/**
  * @tokens Font Sizes
  * @presenter FontSize
  */

       --dscale: 50;`);
  });
  
  it('with weight generate weight tokens', async () => {
    const outcome = generateTypographyTokenBody([typographyWeightToken]);
    expect(outcome).toBe(`
/**
  * @tokens Font Weights
  * @presenter FontWeight
  */

       --dseight: 50;`);
  });

});


