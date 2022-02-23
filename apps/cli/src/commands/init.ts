import type { CommandBuilder } from 'yargs';
import { logger } from '../logger';

import * as inquirer from "./init/inquirer";
import * as repo from "./init/repo";

type Options = {};

export const command: string = 'init';
export const desc: string = 'Init new Design System Started';

export const builder: CommandBuilder<Options, Options> = (yargs) => {
  return yargs;
}

export const handler = async () => {
  await run();
  process.exit(0);
};

const run = async () => {
  logger.info("💿 Welcome to Radius! Let's get you set up with a new project.\n\r")
  const designSystemOptions = await inquirer.askForDesignSystemOptions();
  repo.cloneRepo(designSystemOptions);
};