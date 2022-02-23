"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_logger_1 = require("@guanghechen/chalk-logger");
const chalk_1 = __importDefault(require("chalk"));
exports.logger = new chalk_logger_1.ChalkLogger({
    name: '@radius/cli',
    level: chalk_logger_1.DEBUG,
    date: false,
    colorful: true, // the default value is true.
}, process.argv);
exports.logger.formatHeader = function (level) {
    let { name } = this;
    const header = `${chalk_1.default.bgWhite.hex('#d44527').bold(` ${name} `)}`;
    return `${header}`;
};
