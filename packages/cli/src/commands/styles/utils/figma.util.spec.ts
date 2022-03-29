import { 
  DesignToken, 
  getTokens, 
  extractFirstNode,
  FigmaFileNodes, 
  NodeRoot, 
  generateTokensV2,
  generateNodes,
  processTypographyToken,
  // processSpacingNode 
  } from './figma.utils'; 
import { 
  filterByTypographySubtype,
  // filterByDescriptionSpacer,
 } from './figmaParser.utils';
// import {DesignToken, getTokens} from './figma.utils';
import { groupByType } from '../lib/radius-styles';
import data from '../lib/__mocks__/figma_file.json';


describe('Get Tokens', () => {
  let output: DesignToken[] = [];
  let byType = null;
  let firstNode: NodeRoot|any = {};

  it('Extract first Node', () =>{
    const demoNode1: any = {};
    const demoNode2: any = {};
    const demoFile: FigmaFileNodes = { nodes:{
      '1':demoNode1,
      '2':demoNode2
    } };
    firstNode = extractFirstNode(demoFile);
    expect(firstNode).toBe(demoNode1);
  });

  it('Generate Token v2', async () =>{
    let generatedTokens = await Promise.resolve(data)
      .then((x: any) => x)
      .then(extractFirstNode)
      .then((x: any): NodeRoot => {
        if (!x) throw new Error('Could not find Node: Tokens not defined');
        const y: NodeRoot = x;
        return y;
      })
      .then(generateTokensV2);
    expect(generatedTokens.length).toBe(63);
  });

  it('Generate Token v2 -- check type', async () =>{
    let generatedTokens = await Promise.resolve(data)
      .then((x: any) => x)
      .then(extractFirstNode)
      .then((x: any): NodeRoot => {
        if (!x) throw new Error('Could not find Node: Tokens not defined');
        const y: NodeRoot = x;
        return y;
      })
      .then((nodes) =>{ 

        return generateNodes(nodes, 'componentSets', filterByTypographySubtype, processTypographyToken);
      });

    expect(Object.keys(generatedTokens).length).toBe(6);
    expect(Object.keys(generatedTokens['Text type']).length).toBe(10);
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
