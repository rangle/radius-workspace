"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
exports.command = 'greet <name>';
exports.desc = 'Greet <name> with Hello';
const builder = (yargs) => {
    console.log('CommandBuilder1');
    return yargs
        .options({
        upper: { type: 'boolean' },
    })
        .positional('name', { type: 'string', demandOption: true });
};
exports.builder = builder;
const handler = (argv) => {
    const { name, upper } = argv;
    const greeting = `Hello, ${name}!`;
    console.log(upper ? greeting.toUpperCase() : greeting);
    process.exit(0);
};
exports.handler = handler;
