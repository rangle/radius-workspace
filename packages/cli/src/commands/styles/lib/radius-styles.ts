import {
  DesignToken,
  getTokens
} from '../utils/figma.utils';
// import { getFileKey, figmaAPIFactory } from '../utils/publish.main';
import { assert } from '../utils/common.utils';
import { groupBy } from '../utils/common.utils';
import renderers from './templates';
import path from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { logger } from '../../../logger';
import chalk from 'chalk';
import { loadFile } from '../utils/figma.loader';

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

export const groupByType = <T extends DesignToken>(list: T[]) => groupBy(list, 'type');

//TODO -> it is not filtering duplicates 
// type designTokenTypes = 'typography' | 'color' | 'spacing' | 'breakpoint' | 'grid' | 'elevation';

// const removeDuplicateTokens = (tokenGroups: DesignTokenGroup, latestTokenGroups: DesignTokenGroup) => {
//   let key: designTokenTypes;
//   for(key in tokenGroups) {
//     if(tokenGroups[key] && latestTokenGroups[key]){
//       const listOfNames: string[] = [];
//       tokenGroups[key] = [...tokenGroups[key], ...latestTokenGroups[key]].filter((designToken: DesignToken)=>{
//         if(listOfNames.includes(designToken.name)){
//           return false;
//         }
//         listOfNames.push(designToken.name);
//         return true;
//       });
//     }
//   }
//   return tokenGroups;
// };

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
  
  //const input = fs.existsSync(figmaFile) ? Promise.resolve(figmaFile): getFileNode(fileId,[nodeId]);

  const tokenGroupsFigmaBlob = await loadFile({ url, token: userToken }).then(getTokens).then(groupByType);
  
  // const figmaAPI = figmaAPIFactory(userToken);
  // const tokenGroupsFigmaApi = await figmaAPI.processStyles(getFileKey(url));
  // console.log(tokenGroupsFigmaApi);

  const files = renderTemplate(tokenGroupsFigmaBlob);

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
