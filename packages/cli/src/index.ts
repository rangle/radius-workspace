#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import 'dotenv/config';

import handleError from './handleError';

clear();

console.log(
  chalk
    .hex('#d44527')
    .bold(
      figlet.textSync('Radius Scripts', { horizontalLayout: 'full' })
    )
);

console.log(chalk.bgWhite(chalk.red('                                Design Systems Accelerated                                ')));

console.log('');

yargs(hideBin(process.argv))
  .commandDir('commands')
  .strict()
  .alias({ h: 'help' })
  .epilogue('For more information, check https://github.com/rangle/radius')
  .fail(handleError).argv;