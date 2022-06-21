import * as publishNodes from './__mocks__/publish.nodes.json';
import * as publishStyles from './__mocks__/publish.styles.json';
import * as publishComponents from './__mocks__/publish.components.json';
import * as publishComponentsNodes from './__mocks__/publish.nodes.components.dt.json';

import { generateGlobalStyles, Options } from './radius-styles';
import axios from 'axios';
// import { NodeDoc, NodeDocument } from './figma.utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getStyles, getStyleNodes and processStyles', () => {
  it('should fail', async() => {
    mockedAxios.get
      .mockResolvedValueOnce(publishStyles)
      .mockResolvedValueOnce(publishNodes)
      .mockResolvedValueOnce(publishComponents)
      .mockResolvedValueOnce(publishComponentsNodes);

    const options: Options = {
      url:'https://api.figma.com/v1/file/TJzz7ZB6pJvpLhjI5DWG3F/',
      userToken: 'xxxxxx-Token-xxxxxx',
      outputDir: './generatedTokens',
      dryRun:true,
      consoleOutput:false
    };
    const files = await generateGlobalStyles(options);
    expect(!!files).toBe(true);
    if(files){ 
      expect(files.length).toBe(8);

      const fileNames = files.map((file) => file[0]);
      expect(fileNames).toStrictEqual([
        './index.css',
        './_color.css',
        './_grid.css',
        './_typography.css',
        './_spacing.css',
        './_elevation.css',
        './_breakpoint.css',
        'styledTokens.json']);
      expect(files[0][0]).toBe('./index.css');
    }
  });
});
