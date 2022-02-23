"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const chalk_1 = __importDefault(require("chalk"));
const logger_1 = require("../logger");
const radius_styles_1 = require("./styles/lib/radius-styles");
exports.command = "styles <url> [<outputDir>] [options...]";
exports.desc = "Generate/update styles for a Radius design system instance";
const builder = (yargs) => {
    yargs
        .positional("url", {
        describe: "The URL of the Source file",
        type: "string",
        demandOption: "Needs to provide source URL",
    })
        .positional("outputDir", {
        describe: "Target Directory for Styles",
        type: "string",
    })
        .options({
        source: {
            group: "Command Options:",
            defaultDescription: "source",
            describe: "The type of source to import",
            default: "figma",
            choices: ["figma"],
            type: "string",
        },
        template: {
            group: "Command Options:",
            defaultDescription: "template",
            describe: "The template to be used to generate style files",
            default: "css-modules",
            choices: ["css-modules", "css-in-js"],
            type: "string",
        },
        dryRun: {
            group: "Command Options:",
            defaultDescription: "dry-run",
            describe: "Don't generate any styles -- output files to stdin",
            default: false,
            type: "boolean",
        },
    });
    return yargs;
};
exports.builder = builder;
const handler = async (args) => {
    logger_1.logger.info("Generating Radius Styles");
    logger_1.logger.info(`Source: ${chalk_1.default.red(args.source)}`);
    logger_1.logger.info(`Template: ${chalk_1.default.red(args.template)}`);
    logger_1.logger.info(`Figma URL: ${chalk_1.default.red(args.url)}`);
    logger_1.logger.info(`Dry Run: ${chalk_1.default.red(args.dryRun)}`);
    const { dryRun, url, outputDir, template } = args;
    const userToken = process.env["FIGMA_TOKEN"];
    if (!userToken) {
        logger_1.logger.error("Authentication Token not found. Use the --token option or set the FIGMA_TOKEN environment variable");
        process.exit(1);
    }
    radius_styles_1.generateGlobalStyles({
        url,
        dryRun,
        template,
        userToken,
        outputDir,
    });
};
exports.handler = handler;
