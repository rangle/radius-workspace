import chalk from 'chalk';
import git from "isomorphic-git";
import gitHttp from "isomorphic-git/http/node";
import path from 'path';
import fs from 'fs';
import Listr from 'listr';
import {logger} from '../../../logger';

type BranchRef = { repo: string, branch: string };
const branchRef = (repo: string, branch: string): BranchRef => ({ repo, branch });
const REPOS = {
    angular: branchRef('rangle/radius-angular', 'main'),
    react: {
        css: branchRef('rangle/radius', 'basic-css'),
        "styled-components": branchRef('rangle/radius', 'basic-styled'),
        emotion: branchRef('rangle/radius', 'basic-emotion'),
    }
};

const isKeyof = <T>(val: T) => {
    const keys = Object.keys(val);
    return (k: keyof never): k is keyof T => keys.includes(k as never);
};
const isReactStyle = isKeyof(REPOS.react);

export const cloneRepo = async (designSystemOptions: any): Promise<boolean> => {
    console.log('');

    try {
        let repoRef: BranchRef | null = null;
        if (designSystemOptions['ds-framework'] === 'angular') {
            repoRef = REPOS.angular;
        } else if (designSystemOptions['ds-framework'] === 'react') {
            const reactStyle = designSystemOptions['ds-react-style'];
            if (!isReactStyle(reactStyle)) { throw new Error(`Expected a supported react style, got: ${ reactStyle }`); }
            repoRef = REPOS.react[reactStyle];
        }

        if (!repoRef) {
            logger.info('coming soon... 😉');
            return false;
        }

        const dir = path.join(process.cwd(), designSystemOptions['ds-name']);

        const gitSetup = [
            {
                title: 'Download',
                task: () => git.clone({
                    fs,
                    dir,
                    http: gitHttp,
                    url: `https://github.com/${ repoRef?.repo }`,
                    depth: 1,
                })
            },
            {
                title: 'Checkout the branch',
                task: () => git.checkout({
                    fs,
                    dir,
                    ref: repoRef?.branch,
                })
                
            }
        ]
        


        // setup the main tasks launcher
        const tasks = new Listr(gitSetup, {concurrent: false});

        // run all of the commands
        await tasks.run().catch((err:any) => {
            throw new Error(err);
        });


        console.log(chalk.green('All done!'));
        console.log('');
        console.log(chalk.green('Follow the below steps to run:'));
        console.log(chalk.green(` - cd ${ designSystemOptions['ds-name'] }`));
        console.log(chalk.green(' - npm install'));
        console.log(chalk.green(' - npm run storybook'));
        return true;

    } catch (error: any) {
        console.log(chalk.red('Couldn\'t clone the repo.'));
        console.log(chalk.red(error?.message));
        return false;
    }
};
