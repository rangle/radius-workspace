import { DesignToken, getTokens, extractFirstNode,FigmaFileNodes } from './figma.utils';
// import {DesignToken, getTokens} from './figma.utils';
import { groupByType } from '../lib/radius-styles';
import data from '../lib/__mocks__/figma_file.json';


describe('Get Tokens', () => {
  let output: DesignToken[] = [];
  let byType = null;

  it('Extract first Node', () =>{
    const demoNode1: any = {};
    const demoNode2: any = {};
    const demoFile: FigmaFileNodes = { nodes:{
      '1':demoNode1,
      '2':demoNode2
    } };
    expect(extractFirstNode(demoFile)).toBe(demoNode1);
  });

  
  it('Get Types', async () => {
    output = await getTokens(data);
    expect(output.length).toBe(71);
  });
  

  it('Get By Type', async () => {
    byType = await groupByType(output);

    // by type, is an object of arrays - these arrays are ready to be consumed
    expect(Object.keys(byType).length).toBe([ 'color', 'spacing', 'breakpoint', 'grid' ].length);
  });

});
