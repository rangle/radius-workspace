// import { convertNodesToTokens, parseGRID, StyleDescriptor } from './publish.main';
import { figmaAPIFactory } from './publish.main';
import * as publishNodes from '../lib/__mocks__/publish.nodes.json';
import * as publishStyles from '../lib/__mocks__/publish.styles.json';
import * as publishComponents from '../lib/__mocks__/publish.components.json';
import * as publishComponentsNodes from '../lib/__mocks__/publish.nodes.components.dt.json';
import axios from 'axios';
// import { NodeDoc, NodeDocument } from './figma.utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// const exampleStyleData = {
//   data:{
//     meta:{
//       styles:[
//         {
//           key: 'e0db952545244f354d49f08bec2860002e22fd6d',
//           file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
//           node_id: '20008:10969',
//           style_type: 'FILL',
//           thumbnail_url: '',
//           name: 'UI/alert/default',
//           description: 'Colour Styles: ui/alert/default (#Token)',
//           created_at: '2022-05-09T18:36:03.444Z',
//           updated_at: '2022-05-09T18:36:03.444Z',
//           user: {
//             id: '716290236385945493',
//             handle: 'xxxx',
//             img_url: 'https://s3-alpha.figma.com/profile/xxx'
//           },
//           sort_position: 'Z'
//         },
//         {
//           key: '18290da001f3b038eeaa3f1e941761c6812c07be',
//           file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
//           node_id: '20029:15098',
//           style_type: 'GRID',
//           thumbnail_url: '',
//           name: 'Mobile (360px)',
//           description: 'Grid Token: --s-mobile-360px-4-columns (#Token, #small, #grid)',
//           created_at: '2022-05-09T18:36:03.438Z',
//           updated_at: '2022-05-09T18:36:03.438Z',
//           user: {
//             id: '716290236385945493',
//             handle: 'xxxx',
//             img_url: 'https://s3-alpha.figma.com/profile/xxx'
//           },
//           sort_position: '!~~{'
//         },
//         {
//           key: 'b495cd185b76fdfb8dd9b058c795baea5d0488e9',
//           file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
//           node_id: '20008:10966',
//           style_type: 'FILL',
//           thumbnail_url: '',
//           name: 'UI/Grayscale/disabled',
//           description: 'Colour Styles: ui/disabled (#Token)',
//           created_at: '2022-05-09T18:36:03.431Z',
//           updated_at: '2022-05-09T18:36:03.431Z',
//           user: {
//             id: '716290236385945493',
//             handle: 'Jxxxx',
//             img_url: 'https://s3-alpha.figma.com/profile/xxx'
//           },
//           sort_position: 'W'
//         }
//       ]
//     }
//   }
// };

// const exampleNodesData = {
//   data:{
//     name: 'xxxx',
//     lastModified: '2022-05-19T18:59:32Z',
//     thumbnailUrl: '',
//     version: '1890938747',
//     role: 'editor',
//     editorType: 'figma',
//     linkAccess: 'inherit',
//     nodes: {
//       '20008:10969': {
//         document: [Object],
//         components: {},
//         componentSets: {},
//         schemaVersion: 0,
//         styles: {}
//       },
//       '20029:15098': {
//         document: [Object],
//         components: {},
//         componentSets: {},
//         schemaVersion: 0,
//         styles: {}
//       },
//       '20008:10966': {
//         document: [Object],
//         components: {},
//         componentSets: {},
//         schemaVersion: 0,
//         styles: {}
//       }
//     }
//   }
// };


// describe('getFileKey', () => {
//   // it('should return the key parsed form the url', async () =>{
//   //   const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
//   //   const styles = await figmaAPI.getStyles('TJzz7ZB6pJvpLhjI5DWG3F');
//   // });
// });


// describe('placeholder test', ()=> {
//   it('placeholder', ()=> {
//     expect(1).toEqual(1);
//   });
// });
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
    expect(Object.keys(values)).toStrictEqual(['grid', 'breakpoint','color','spacing', 'typography', 'elevation']);
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
    const componentsTokens = await figmaAPI._processStyleComponents('TJzz7ZB6pJvpLhjI5DWG3F');

    expect(componentsTokens.length).toEqual(12);
    expect(!!componentsTokens[0]?.node_id).toEqual(true);
    expect(!!componentsTokens[0]?.type).toEqual(true);
    expect(!!componentsTokens[0]?.name).toEqual(true);
  });
}); 
