import type { CommandBuilder } from 'yargs';

type Options = {};

export const command: string = 'tracker';
export const desc: string = 'Detect snowflakes and target usages in the specified codebase';

export const builder: CommandBuilder<Options, Options> = (yargs) => {
  return yargs;
}

export const handler = () => {
  process.exit(0);
};