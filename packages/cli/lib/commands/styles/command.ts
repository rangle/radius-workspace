import { CommandModule } from "yargs";
import { generateGlobalStyles, Options } from "./lib/radius-styles";

export const styles: CommandModule<Options, Options> = {
  command: "styles <url> [<outputDir>] [options...]",

  describe: "Generate/update styles for a Radius design system instance",

  builder: (yargs) => {
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
  },

  handler: (args) => {
    console.log("GENERATING RADIUS's STYLES");
    const { dryRun, url, outputDir, template } = args;
    const userToken = process.env["FIGMA_TOKEN"];
    if (!userToken) {
      console.error(
        "Authentication Token not found. Use the --token option or set the FIGMA_TOKEN environment variable"
      );
      process.exit(1);
    }
    console.log("source:", args["source"]);
    console.log("url:", args["url"]);
    console.log("template:", args["template"]);
    generateGlobalStyles({
      url,
      dryRun,
      template,
      userToken,
      outputDir,
    });
  },
};
