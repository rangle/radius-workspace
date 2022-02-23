#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const clear_1 = __importDefault(require("clear"));
const figlet_1 = __importDefault(require("figlet"));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
require("dotenv/config");
const handleError_1 = __importDefault(require("./handleError"));
clear_1.default();
console.log(chalk_1.default
    .hex('#d44527')
    .bold(figlet_1.default.textSync('Radius Scripts', { horizontalLayout: 'full' })));
console.log(chalk_1.default.bgWhite(chalk_1.default.red('                                Design Systems Accelerated                                ')));
console.log('');
yargs_1.default(helpers_1.hideBin(process.argv))
    .commandDir('commands')
    .strict()
    .alias({ h: 'help' })
    .epilogue('For more information, check https://github.com/rangle/radius')
    .fail(handleError_1.default).argv;
