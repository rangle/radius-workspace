import {
  assert,
  DesignToken,
  getTokens,
  processFigmaUrl,
  setup
} from '../utils/figma.utils';
import { groupBy } from '../utils/common.utils';
import renderers from './templates';
import path from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { logger } from '../../../logger';
import chalk from 'chalk';
import fs from 'fs';

const token = process.env['FIGMA_TOKEN'] || 'none';
const figmaFilePath = 'packages/cli/src/commands/styles/lib/__mocks__/figma_file.json';

export type Options = {
  url: string,
  userToken?: string,
  outputDir?: string,
  dryRun?: boolean,
  consoleOutput?: boolean,
  template?: 'css-modules' | 'css-in-js',
};

const groupByType = <T extends DesignToken>(list: T[]) => groupBy(list, 'type');

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
  const { getFileNode } = setup(userToken);
  const { fileId, nodeId } = processFigmaUrl({ url, token: userToken });

  const input = existsSync(
    path.resolve(figmaFilePath)) ? Promise.resolve(getMockJsonData): getFileNode(fileId,[nodeId]);
  const tokenGroups = await input.then(getTokens).then(groupByType);
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
        !dryRun && mkdirSync(fileDir);
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

const getMockJsonData = () => {
  let jsonFile;
  try {
    jsonFile = JSON.parse(fs.readFileSync(path.resolve(figmaFilePath), 'utf8'));
  } catch(err) {
    console.log(err);
  }
  return jsonFile;
};
