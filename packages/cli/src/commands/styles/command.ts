import chalk from 'chalk';
import inquirer, { QuestionCollection } from 'inquirer';
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
      .options({

      })
    ;
    return yargs;
  },

  handler: (args) => {

    // type Question = 
    // {
    //   name: 'ds-styles-dir' | 'ds-name',
    //   type: string,
    //   message: string,
    // };
 
    const questions: QuestionCollection = [
      {
        name: 'ds-styles-dir',
        type: 'input',
        message: 'Enter the name of the directory '
      },
      {
        name: 'ds-name',
        type: 'input',
        message: 'Enter the name of the project '
      }
    ];

    inquirer.prompt(questions).then((questionsResp)=>{
      const userOutputDir = questionsResp['ds-styles-dir'];

      logger.info('Generating Radius Styles');
      logger.info(`Source: ${ chalk.red(args.source) }`);
      logger.info(`Template: ${ chalk.red(args.template) }`);
      logger.info(`Figma URL: ${ chalk.red(args.url) }`);
      logger.info(`Dry Run: ${ chalk.red(args.dryRun) }`);
  
      // const { dryRun, url, outputDir, template } = args;
      const { template } = args;
      const userToken = process.env['FIGMA_TOKEN'];
      if (!userToken) {
        logger.error(
          'Authentication Token not found. Use the --token option or set the FIGMA_TOKEN environment variable'
        );
        process.exit(1);
      }

      const options: Options = {
        url: 'https://www.figma.com/file/TJzz7ZB6pJvpLhjI5DWG3F/Radius-Design-Kit-V2(WIP)?node-id=725%3A8261',
        userToken: userToken,
        outputDir: userOutputDir,
        dryRun: false,
        consoleOutput: false,
        template: template
      };

      generateGlobalStyles(
        options
      );
      // generateGlobalStyles({
      //   url,
      //   dryRun,
      //   template,
      //   userToken,
      //   userOutputDir
      // });
    });
   
  }
};
