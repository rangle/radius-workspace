"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const logger_1 = require("../logger");
const inquirer = __importStar(require("./init/inquirer"));
const repo = __importStar(require("./init/repo"));
exports.command = 'init';
exports.desc = 'Init new Design System Started';
const builder = (yargs) => {
    return yargs;
};
exports.builder = builder;
const handler = async () => {
    await run();
    process.exit(0);
};
exports.handler = handler;
const run = async () => {
    logger_1.logger.info("💿 Welcome to Radius! Let's get you set up with a new project.\n\r");
    const designSystemOptions = await inquirer.askForDesignSystemOptions();
    repo.cloneRepo(designSystemOptions);
};
