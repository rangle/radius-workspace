"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
exports.command = 'tracker';
exports.desc = 'Detect snowflakes and target usages in the specified codebase';
const builder = (yargs) => {
    return yargs;
};
exports.builder = builder;
const handler = () => {
    process.exit(0);
};
exports.handler = handler;
