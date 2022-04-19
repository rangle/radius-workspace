import chalk from 'chalk';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import { CommandModule } from 'yargs';
import { logger } from '../../logger';
import { generateGlobalStyles, Options } from './lib/radius-styles';

export const styles: CommandModule<Options, Options> = {
  command: 'styles',

  describe: 'Generate/update styles for a Radius design system instance',

  builder: (yargs) => {
    yargs
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
          type: 'string',
          dir: 'string'
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
        name: 'styles-dir',
        type: 'input',
        message: 'Please enter the name of the styles directory',
        default: 'src/styles'
      }
    ];

    const answers: Answers = await inquirer.prompt(questions);
    const stylesDir = answers['styles-dir'];
    const figmaUrl = answers['figma-url'];
    const figmaToken = answers['figma-token'];

    logger.info('Generating Radius Styles');
    logger.info(`Source: ${ chalk.red(args.source) }`);
    logger.info(`Template: ${ chalk.red(args.template) }`);
    logger.info(`Figma URL: ${ chalk.red(figmaUrl) }`);
    logger.info(`Dry Run: ${ chalk.red(args.dryRun) }`);

    const { template, dryRun } = args;

    const options: Options = {
      url: figmaUrl,
      userToken: figmaToken,
      outputDir: stylesDir,
      dryRun: dryRun,
      consoleOutput: false,
      template: template
    };

    generateGlobalStyles(
      options
    );
  }
};
