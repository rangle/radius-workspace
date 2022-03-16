import { CommandModule } from "yargs";

import { logger } from "../../logger";

import * as inquirer from "./utils/inquirer";
import * as repo from "./utils/repo";

type Options = {};

export const init: CommandModule<Options, Options> = {
    command: "init",
    describe: "Init new Design System Starter",

    builder: yargs => {
        return yargs;
    },
  
    handler: async () => {
        logger.info("💿 Welcome to Radius! Let's get you set up with a new project.\n\r");
        const designSystemOptions = await inquirer.askForDesignSystemOptions();
        const success = await repo.cloneRepo(designSystemOptions);
        process.exit(success ? 0 : 1);
    },
};
