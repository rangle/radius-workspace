"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRepo = void 0;
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const degit_1 = __importDefault(require("degit"));
const logger_1 = require("../../logger");
const REPOS = {
    angular: 'rangle/radius-angular#main',
    react: {
        css: 'rangle/radius#basic-css',
        "styled-components": 'rangle/radius#basic-styled',
        emotion: 'rangle/radius#basic-emotion'
    }
};
const cloneRepo = (designSystemOptions) => {
    console.log('');
    try {
        let repoURL;
        if (designSystemOptions['ds-framework'] === 'angular') {
            repoURL = REPOS.angular;
        }
        else if (designSystemOptions['ds-framework'] === 'react') {
            repoURL = REPOS.react[designSystemOptions['ds-react-style']];
        }
        if (repoURL) {
            const spinner = ora_1.default(chalk_1.default.hex('#d44527').bold('Initializing design system repository and cloning from remote...')).start();
            const emitter = degit_1.default(repoURL);
            emitter.on('info', (info) => {
                // console.log(chalk.green(info.message));
            });
            console.log('');
            console.log('');
            emitter.clone(designSystemOptions['ds-name']).then(() => {
                spinner.stop();
                console.log(chalk_1.default.green('All done!'));
                console.log('');
                console.log(chalk_1.default.green('Follow the below steps to run:'));
                console.log(chalk_1.default.green(` - cd ${designSystemOptions['ds-name']}`));
                console.log(chalk_1.default.green(' - npm install'));
                console.log(chalk_1.default.green(' - npm run storybook'));
            });
        }
        else {
            logger_1.logger.info('coming soon... 😉');
        }
    }
    catch (error) {
        console.log(chalk_1.default.red('Couldn\'t clone the repo.'));
        console.log(chalk_1.default.red(error?.message));
    }
};
exports.cloneRepo = cloneRepo;
