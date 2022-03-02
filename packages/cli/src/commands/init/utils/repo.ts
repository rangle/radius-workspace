import ora from 'ora';
import chalk from 'chalk';
import git from "isomorphic-git";
import gitHttp from "isomorphic-git/http/node";
import path from 'path';
import {Volume} from "memfs";
import {logger} from '../../../logger';

const REPOS: any = {
    angular: 'rangle/radius-angular#main',
    react: {
        css: 'rangle/radius#basic-css',
        "styled-components": 'rangle/radius#basic-styled',
        emotion: 'rangle/radius#basic-emotion'
    }
};

export const cloneRepo = async (designSystemOptions: any) => {
    console.log('');

    try {
        let repoURL;
        if (designSystemOptions['ds-framework'] === 'angular') {
            repoURL = REPOS.angular;
        } else if (designSystemOptions['ds-framework'] === 'react') {
            repoURL = REPOS.react[designSystemOptions['ds-react-style']];
        }

        if (repoURL) {
            const spinner = ora(chalk.hex('#d44527').bold('Initializing design system repository and cloning from remote...')).start();
            const cloneFs = Volume.fromJSON({});

            await git.clone({
                fs: {promises: cloneFs.promises},
                http: gitHttp,
                dir: path.join(process.cwd(), designSystemOptions['ds-name']),
                url: repoURL,
                depth: 1,
                // singleBranch: true,
                corsProxy: "https://cors.isomorphic-git.org"
            }).then(() => {
                spinner.stop();
                console.log(chalk.green('All done!'));
                console.log('');
                console.log(chalk.green('Follow the below steps to run:'));
                console.log(chalk.green(` - cd ${designSystemOptions['ds-name']}`));
                console.log(chalk.green(' - npm install'));
                console.log(chalk.green(' - npm run storybook'));
            });
            console.log('done');

        } else {
            logger.info('coming soon... 😉');
        }

    } catch (error: any) {
        console.log(chalk.red('Couldn\'t clone the repo.'));
        console.log(chalk.red(error?.message));
    }
};