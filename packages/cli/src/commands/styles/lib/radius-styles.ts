/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DesignToken,
  extractFirstNode,
  getTokens,
  NodeRoot
} from '../utils/figma.utils';
import { assert } from '../utils/common.utils';
import { groupBy } from '../utils/common.utils';
import renderers from './templates';
import path from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { logger } from '../../../logger';
import chalk from 'chalk';
import { loadFile } from '../utils/figma.loader';

import { 
} from '../utils/figmaParser.utils';
import { figmaResolver, tokenSelector } from '../utils/figmaResolver.utils';

import figmaConfig from '../../../../figmaFileConfig.json';

const token = process.env['FIGMA_TOKEN'] || 'none';
// const figmaFile = './__mocks__/figma-file-2021-09-03T00:53:20.007Z.json';

export type Options = {
  url: string,
  userToken?: string,
  outputDir?: string,
  dryRun?: boolean,
  consoleOutput?: boolean,
  template?: 'css-modules' | 'css-in-js',
};

const groupByType = <T extends DesignToken>(list: T[]) => groupBy(list, 'type');

const getBlobs = (userToken: string) => {
  const promises = [];
  for (const url of figmaConfig.urls) {
    promises.push(loadFile({ url, token: userToken }));
  }
  return Promise.all(promises);
};

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
  const designTokens: DesignToken[] = [];

  // 
  await getBlobs(userToken).then((data) => {
    const nodeRoots = data.flatMap((node) => {
      const root: NodeRoot = extractFirstNode(node);


      // example 1 
      const colors = figmaResolver.withOptions.colors([tokenSelector.option.color]);
      const typography = figmaResolver.withOptions.typography([tokenSelector.option.typography]);

      const colorNodes = colors(root);
      const typographyNodes = typography(root);

      // example 2 
      // const parsedColors = figmaResolver.parser.colors(root);
      // const parsedTypography = figmaResolver.parser.typography(root);
      console.log(colorNodes);
      console.log(typographyNodes);

      console.log(nodeRoots);
      console.log(designTokens.filter((dToken) => dToken.name?.includes('$')));
      console.log(data);
    });
  });

  const renderTemplate = renderers[template];

  const tokenGroups = await loadFile({ url, token: userToken }).then(getTokens).then(groupByType);

  const files = renderTemplate(tokenGroups);

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