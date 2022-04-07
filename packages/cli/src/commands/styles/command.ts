import chalk from 'chalk';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import { CommandModule } from 'yargs';
import { logger } from '../../logger';
import { generateGlobalStyles, Options } from './lib/radius-styles';

export const styles: CommandModule<Options, Options> = {
  command: 'styles <url> [<outputDir>] [options...]',

  describe: 'Generate/update styles for a Radius design system instance',

  builder: (yargs) => {
    yargs
      .positional('url', {
        describe: 'The URL of the Source file',
        type: 'string',
        demandOption: 'Needs to provide source URL'
      })
      .positional('outputDir', {
        describe: 'Target Directory for Styles',
        type: 'string'
      })
      .options({
        source: {
          group: 'Command Options:',
          defaultDescription: 'source',
          describe: 'The type of source to import',
          default: 'figma',
          choices: ['figma'],
          type: 'string'
        },
        template: {
          group: 'Command Options:',
          defaultDescription: 'template',
          describe: 'The template to be used to generate style files',
          default: 'css-modules',
          choices: ['css-modules', 'css-in-js'],
          type: 'string'
        },
        dryRun: {
          group: 'Command Options:',
          defaultDescription: 'dry-run',
          describe: 'Don\'t generate any styles -- output files to stdin',
          default: false,
          type: 'boolean'
        }
      })
    ;
    return yargs;
  },


  handler: async (args) => {
    const questions: QuestionCollection = [
      {
        name: 'ds-styles-dir',
        type: 'input',
        message: 'Please enter the name of the project (This name should match the design system name)'
      },
      {
        name: 'figma-url',
        type: 'input',
        message: 'Please enter your Figma URL'
      },
      {
        name: 'figma-token',
        type: 'input',
        message: 'Please enter your Figma token'
      },
      {
        name: 'css-files-directory',
        type: 'input',
        message: 'Please enter a directory to create the files in '
      }
    ];

    const answers: Answers = await inquirer.prompt(questions);
    const userOutputDir = answers['css-files-directory'];
    const figmaUrl = answers['figma-url'];
    const figmaToken = answers['figma-token'];
    // const cssFilesDirectory = answers['css-files-directory'];

    logger.info('Generating Radius Styles');
    logger.info(`Source: ${ chalk.red(args.source) }`);
    logger.info(`Template: ${ chalk.red(args.template) }`);
    logger.info(`Figma URL: ${ chalk.red(figmaUrl) }`);
    logger.info(`Dry Run: ${ chalk.red(args.dryRun) }`);

    const { template, dryRun } = args;

    if (!figmaUrl) {
      logger.error(
        'Figma URL Not Found, Please run styles command again and provide the URL'
      );
      process.exit(1);
    }
    
    if (!figmaToken) {
      logger.error(
        'Figma Token Not Found, Please run styles command again and provide the token'
      );
      process.exit(1);
    }


    const options: Options = {
      url: figmaUrl,
      userToken: figmaToken,
      outputDir: userOutputDir,
      dryRun: dryRun,
      consoleOutput: false,
      template: template
    };

    generateGlobalStyles(
      options
    );
  }
};
