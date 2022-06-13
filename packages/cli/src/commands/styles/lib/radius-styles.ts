/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DesignToken
} from '../utils/figma.utils';
import { figmaAPIFactory } from '../utils/publish.main';
import { assert } from '../utils/common.utils';
import { groupBy } from '../utils/common.utils';
import renderers from './templates';
import path from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { logger } from '../../../logger';
import chalk from 'chalk';

const token = process.env['FIGMA_TOKEN'] || 'none';
// const figmaFile = './__mocks__/figma-file-2021-09-03T00:53:20.007Z.json';

// V3 - used with FigmaResolver
// const tokenOption: TokenOption<NodeDoc> = {
//   option: {
//     'color': [isColor2, getColor2],
//     'typography': [isTypographyFormat2, getTypography2]
//   }
// };

export type Options = {
  url: string,
  userToken?: string,
  outputDir?: string,
  dryRun?: boolean,
  consoleOutput?: boolean,
  template?: 'css-modules' | 'css-in-js',
};

export const groupByType = <T extends DesignToken>(list: T[]) => groupBy(list, 'type');

export const generateGlobalStyles = async ({
  url,
  userToken = token,
  outputDir = '.',
  dryRun,
  consoleOutput,
  template = 'css-modules'
}: Options) => {
  assert(userToken !== 'none', 'Environment variable FIGMA_TOKEN is empty');
  assert(typeof url === 'string', 'Figma url must be provided');

  const renderTemplate = renderers[template];

  const figmaAPI = figmaAPIFactory(userToken);
  const designTokens = await figmaAPI.processStyles(url);

  // Using DynamicParser
  // const retrievedNodes = await getFigmaBlobs(userToken).then((data: FigmaNodeKey[]) => {
  //   return transformNodes(data); 
  // });

  const files = renderTemplate(designTokens);

  if(dryRun) return files;

  if (consoleOutput) {
    // files.forEach(([fileName, content]) => {
    //   // TODO: find out whether we want to generate a single file
    //   // console.log(`/* ${fileName} */`);
    //   // console.log(content);
    // });
  } else {
    logger.info(`output directory: ${ chalk.red(outputDir) }`);
        
    files.forEach(([fileName, content]) => {
      const filePath = path.resolve(outputDir ?? '.', fileName);
      const fileDir = path.dirname(filePath);

      dryRun && console.log('// Dry run');

      if (!existsSync(fileDir)) {
        logger.info(`creating directory: ${ chalk.red(fileDir) }`);
        !dryRun && mkdirSync(fileDir, { recursive: true });
      }

      if (existsSync(filePath)) {
        logger.info(`file exists. overwriting: ${ chalk.red(filePath) }`);
      }

      logger.info(`writing file: ${ chalk.red(fileName) }`);
      // logger.info(content);

      !dryRun && writeFileSync(filePath, content);
    });
  }
};