// import { convertNodesToTokens, parseGRID, StyleDescriptor } from './publish.main';
import { figmaAPIFactory } from './publish.main';
import * as publishNodes from '../lib/__mocks__/publish.nodes.json';
import * as publishStyles from '../lib/__mocks__/publish.styles.json';
import * as publishComponents from '../lib/__mocks__/publish.components.json';
import * as publishComponentsNodes from '../lib/__mocks__/publish.nodes.components.dt.json';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getStyles, getStyleNodes and processStyles', () => {
  it('should fail', async() => {
    mockedAxios.get.mockRejectedValue(publishStyles);
    expect.assertions(1);
    try {
      const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
      await figmaAPI._getStyles('a bad url');
    } catch (error: any){
      expect(error?.message).toBe('Failed to parse figma url, https://api.figma.com/v1/files/a bad url/styles');
    }
  });

  it('test geting style should return node list and style list', async ()  => {
    mockedAxios.get.mockResolvedValueOnce(publishStyles);
    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const styles = await figmaAPI._getStyles('TJzz7ZB6pJvpLhjI5DWG3F');
    expect(styles.length).toBe(66);
  });

  it('gets data from full mock values', async ()  => {
    mockedAxios.get
      .mockResolvedValueOnce(publishStyles)
      .mockResolvedValueOnce(publishNodes)
      .mockResolvedValueOnce(publishComponents)
      .mockResolvedValueOnce(publishComponentsNodes);

    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const values = await figmaAPI.processStyles('TJzz7ZB6pJvpLhjI5DWG3F');
    expect(Object.keys(values)).toStrictEqual([
      'color','typography', 'grid', 'breakpoint','spacing','elevation','button','attention box','alert'
    ]);
    expect(values['typography'][0].type).toStrictEqual('typography');

  });
});


describe('get components', () => {
  it('should return undefined', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data:{} });
    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const components = await figmaAPI._getComponents('TJzz7ZB6pJvpLhjI5DWG3F');
    expect(components).toEqual(undefined);
  });

  it('should return the data', async () => {
    mockedAxios.get.mockResolvedValueOnce(publishComponents);
    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const components = await figmaAPI._getComponents('TJzz7ZB6pJvpLhjI5DWG3F');
    if(components === undefined) {
      expect(components).toBe(!undefined);
    } else {
      expect(components.length).toEqual(464);
      expect(!!components[0]?.node_id).toEqual(true);
      expect(!!components[0]?.created_at).toEqual(true);
      expect(!!components[0]?.description).toEqual(true);
    }
  });

  it('should create design tokens', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(publishComponents)
      .mockResolvedValueOnce(publishComponentsNodes);
    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const componentsTokens = await figmaAPI._processStyleComponents('TJzz7ZB6pJvpLhjI5DWG3F',[]);

    expect(componentsTokens.length).toEqual(62);
    expect(!!componentsTokens[0]?.node_id).toEqual(true);
    expect(!!componentsTokens[0]?.type).toEqual(true);
    expect(!!componentsTokens[0]?.name).toEqual(true);
  });
}); 


// import * as componentsNodesUndefined from '../lib/__mocks__/componentTokens-undefined.json';

// describe('get components groups', () => {
//   it('parse the componentTokens', async () => {
//     console.log(componentsNodesUndefined);
//   });
// });