
import chalk from 'chalk';
import figlet from 'figlet';
import factory from "yargs/yargs";
import { CommandModule } from "yargs";

import 'dotenv/config';

// import handleError from './handleError';

import { styles } from "./commands/styles";
import { init } from "./commands/init";

console.log(
  chalk
    .hex('#d44527')
    .bold(
      figlet.textSync('Radius Scripts', { horizontalLayout: 'full' })
    )
);

console.log(chalk.bgWhite(chalk.red('                                Design Systems Accelerated                                ')));

console.log('');

module.exports = function cli(cwd: string) {
  const parser = factory(undefined, cwd);

  parser.alias("h", "help");
  parser.alias("v", "version");
  parser.epilogue('For more information, check https://github.com/rangle/radius');

  parser
    .usage("Usage: $0 <command> [options]")
    .demandCommand(
      1,
      "A command is required. Pass --help to see all available commands and options."
    )
    .command(init as CommandModule)
    .command(styles as CommandModule);
  // .fail(handleError).argv;

  return parser;
};
