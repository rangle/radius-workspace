import { getFileKey, colorToHex, figmaAPIFactory, parseType } from './publish.main';
import * as publishNodes from '../lib/__mocks__/publish.nodes.json';
import * as publishStyles from '../lib/__mocks__/publish.styles.json';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const exampleStyleData = {
  data:{
    meta:{
      styles:[
        {
          key: 'e0db952545244f354d49f08bec2860002e22fd6d',
          file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
          node_id: '20008:10969',
          style_type: 'FILL',
          thumbnail_url: '',
          name: 'UI/alert/default',
          description: 'Colour Styles: ui/alert/default (#Token)',
          created_at: '2022-05-09T18:36:03.444Z',
          updated_at: '2022-05-09T18:36:03.444Z',
          user: {
            id: '716290236385945493',
            handle: 'xxxx',
            img_url: 'https://s3-alpha.figma.com/profile/xxx'
          },
          sort_position: 'Z'
        },
        {
          key: '18290da001f3b038eeaa3f1e941761c6812c07be',
          file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
          node_id: '20029:15098',
          style_type: 'GRID',
          thumbnail_url: '',
          name: 'Mobile (360px)',
          description: 'Grid Token: --s-mobile-360px-4-columns (#Token, #small, #grid)',
          created_at: '2022-05-09T18:36:03.438Z',
          updated_at: '2022-05-09T18:36:03.438Z',
          user: {
            id: '716290236385945493',
            handle: 'xxxx',
            img_url: 'https://s3-alpha.figma.com/profile/xxx'
          },
          sort_position: '!~~{'
        },
        {
          key: 'b495cd185b76fdfb8dd9b058c795baea5d0488e9',
          file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
          node_id: '20008:10966',
          style_type: 'FILL',
          thumbnail_url: '',
          name: 'UI/Grayscale/disabled',
          description: 'Colour Styles: ui/disabled (#Token)',
          created_at: '2022-05-09T18:36:03.431Z',
          updated_at: '2022-05-09T18:36:03.431Z',
          user: {
            id: '716290236385945493',
            handle: 'Jxxxx',
            img_url: 'https://s3-alpha.figma.com/profile/xxx'
          },
          sort_position: 'W'
        }
      ]
    }
  }
};

const exampleNodesData = {
  data:{
    name: 'xxxx',
    lastModified: '2022-05-19T18:59:32Z',
    thumbnailUrl: '',
    version: '1890938747',
    role: 'editor',
    editorType: 'figma',
    linkAccess: 'inherit',
    nodes: {
      '20008:10969': {
        document: [Object],
        components: {},
        componentSets: {},
        schemaVersion: 0,
        styles: {}
      },
      '20029:15098': {
        document: [Object],
        components: {},
        componentSets: {},
        schemaVersion: 0,
        styles: {}
      },
      '20008:10966': {
        document: [Object],
        components: {},
        componentSets: {},
        schemaVersion: 0,
        styles: {}
      }
    }
  }
};

describe('getFileKey', () => {
  it('should return the key parsed form the url', () =>{
    const exampleURL = 'https://www.figma.com/file/TJzz7ZB6pJvpLhjI5DWG3F/Radius-Design-Kit-V2(WIP)?node-id=0%3A1';
    expect(getFileKey(exampleURL)).toBe('TJzz7ZB6pJvpLhjI5DWG3F');
  });
});

describe('colorToHex', () => {
  it('should return Hex from colour', () =>{
    expect(colorToHex({ r:0,g:0,b:0 })).toBe('#000000');
  });
});

describe('getStyles, getStyleNodes and processStyles', () => {
  it('test geting style should return node list and style list', async ()  => {
    mockedAxios.get.mockResolvedValueOnce(exampleStyleData);
    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const styles = await figmaAPI.getStyles('TJzz7ZB6pJvpLhjI5DWG3F');

    expect(styles.nodes).toStrictEqual([ '20008:10969', '20029:15098', '20008:10966' ]);
    expect(Object.keys(styles.styles).length).toBe(3);
  });

  it('gets the node styles', async ()  => {
    mockedAxios.get.mockResolvedValueOnce(exampleNodesData);
    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const styles = await figmaAPI.getStyleNodes(
      'TJzz7ZB6pJvpLhjI5DWG3F',
      [ '20008:10969', '20029:15098', '20008:10966' ]
    );
    expect(Object.keys(styles)).toStrictEqual([ '20008:10969', '20029:15098', '20008:10966' ]);

    expect(Object.keys(styles['20008:10969'])).toStrictEqual(
      [ 'document','components','componentSets','schemaVersion','styles' ]
    );    
  });


  it('gets data from full mock values', async ()  => {
    mockedAxios.get
      .mockResolvedValueOnce(publishStyles)
      .mockResolvedValueOnce(publishNodes);

    const figmaAPI = figmaAPIFactory('x-x-x-x-x-x');
    const values = await figmaAPI.processStyles('TJzz7ZB6pJvpLhjI5DWG3F');
    expect(Object.keys(values)).toStrictEqual(['typography', 'color']);    
  });
});

describe('parseType', () => {
  const colorStyle = {
    key: 'f9b164d248ace903e06565a46e043f59d051e049',
    file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
    node_id: '20008:10971',
    style_type: 'FILL',
    thumbnail_url: '',
    name: 'background/2',
    description: 'Colour Styles: --background-2-colour (#Token)',
    created_at: '2022-05-09T18:36:06.675Z',
    updated_at: '2022-05-09T18:36:06.675Z',
    user: {
      id: '716290236385945493',
      handle: ' ',
      img_url: 'https://s3-alpha.figma.com/profile/e70a680e-ef91-44a3-aab5-b6be011f33dd'
    },
    sort_position: '\\'
  };
  const colorDoc = {
    id: '20008:10971',
    name: 'background/2',
    type: 'RECTANGLE',
    blendMode: 'PASS_THROUGH',
    absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
    constraints: { vertical: 'TOP', horizontal: 'LEFT' },
    fills: [ { blendMode: 'NORMAL', type: 'SOLID', color: { r:0,g:0,b:0 } } ],
    strokes: [],
    strokeWeight: 1,
    strokeAlign: 'INSIDE',
    effects: []
  };

  it('should parseType color', () =>{
    expect(parseType(colorStyle,colorDoc)).toStrictEqual({
      type:'color',
      name:'background/2',
      token:'--background-2',
      value:'#000000'
    });
  });
  
  const typeStyle = {
    key: '30391beffefd13e8c0c224fc3732183ef79cad2d',
    file_key: 'TJzz7ZB6pJvpLhjI5DWG3F',
    node_id: '20519:3927',
    style_type: 'TEXT',
    thumbnail_url: '',
    name: 'inline/m/hover',
    description: '',
    created_at: '2022-05-09T18:36:03.466Z',
    updated_at: '2022-05-09T18:36:03.466Z',
    user: {
      id: '716290236385945493',
      handle: ' ',
      img_url: 'https://s3-alpha.figma.com/profile/e70a680e-ef91-44a3-aab5-b6be011f33dd'
    },
    sort_position: '!~~q|'
  };
  const typeDoc = {
    id: '20519:3927',
    name: 'inline/m/hover',
    type: 'TEXT',
    blendMode: 'PASS_THROUGH',
    absoluteBoundingBox: { x: 0, y: 0, width: 59, height: 24 },
    constraints: { vertical: 'TOP', horizontal: 'LEFT' },
    fills: [ { blendMode: 'NORMAL', type: 'SOLID', color: [Object] } ],
    strokes: [],
    strokeWeight: 0,
    strokeAlign: 'INSIDE',
    effects: [],
    characters: 'Rag 123',
    style: {
      fontFamily: 'Roboto',
      fontPostScriptName: 'Roboto-Medium',
      fontWeight: 500,
      textAutoResize: 'WIDTH_AND_HEIGHT',
      textDecoration: 'UNDERLINE',
      fontSize: 16,
      textAlignHorizontal: 'LEFT',
      textAlignVertical: 'TOP',
      letterSpacing: 0,
      lineHeightPx: 24,
      lineHeightPercent: 128,
      lineHeightPercentFontSize: 150,
      lineHeightUnit: 'FONT_SIZE_%'
    },
    layoutVersion: 3,
    characterStyleOverrides: [],
    styleOverrideTable: {},
    lineTypes: [ 'NONE' ],
    lineIndentations: [ 0 ]
  };

  it('should parseType typography', () =>{
    expect(parseType(typeStyle,typeDoc)).toStrictEqual([{
      cascade: false,
      name: 'inline/m/fontFamily',
      token: '--inline-m-font-family',
      type: 'typography',
      value: 'Roboto',
      viewPort: 'h'
    },{
      cascade: false,
      name: 'inline/m/fontWeight',
      token: '--inline-m-font-weight',
      type: 'typography',
      value: '500',
      viewPort: 'h'
    },{
      cascade: false,
      name: 'inline/m/fontSize',
      token: '--inline-m-font-size',
      type: 'typography',
      value: '16',
      viewPort: 'h'
    },{
      cascade: false,
      name: 'inline/m/letterSpacing',
      token: '--inline-m-letter-spacing',
      type: 'typography',
      value: '0',
      viewPort: 'h'
    },{
      cascade: false,
      name: 'inline/m/lineHeightPercent',
      token: '--inline-m-line-height-percent',
      type: 'typography',
      value: '128',
      viewPort: 'h'
    }]);
  });
  

});