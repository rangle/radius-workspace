"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs/yargs"));
module.exports = function cli(cwd) {
    var parser = yargs_1.default(undefined, cwd);
    parser.alias("h", "help");
    parser.alias("v", "version");
    parser
        .usage("Usage: $0 <command> [options]")
        .demandCommand(1, "A command is required. Pass --help to see all available commands and options.");
    return parser;
};
//# sourceMappingURL=cli.js.map