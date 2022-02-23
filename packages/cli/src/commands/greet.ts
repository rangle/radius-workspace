import type { Arguments, CommandBuilder } from 'yargs';

type Options = {
  name: string;
  upper: boolean | undefined;
};

export const command: string = 'greet <name>';
export const desc: string = 'Greet <name> with Hello';


export const builder: CommandBuilder<Options, Options> = (yargs) => {
  console.log('CommandBuilder1');
  return yargs
    .options({
      upper: { type: 'boolean' },
    })
    .positional('name', { type: 'string', demandOption: true });
}


export const handler = (argv: Arguments<Options>): void => {
  const { name, upper } = argv;
  const greeting = `Hello, ${name}!`;
  console.log(upper ? greeting.toUpperCase() : greeting);
  process.exit(0);
};