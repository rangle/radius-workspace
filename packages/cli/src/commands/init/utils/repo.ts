import chalk from 'chalk';
import git from "isomorphic-git";
import gitHttp from "isomorphic-git/http/node";
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import Listr from 'listr';
import {logger} from '../../../logger';

type BranchRef = { repo: string, branch: string, styleDir: string[] };
const branchRef = (repo: string, branch: string, styleDir: string[]): BranchRef => ({ repo, branch, styleDir });
const REPOS = {
    angular: branchRef('rangle/radius-angular', 'main', ['projects','demo','src','styles']),
    react: {
        css: branchRef('rangle/radius', 'basic-css', ['src','styles']),
        "styled-components": branchRef('rangle/radius', 'basic-styled', ['src','styles']),
        emotion: branchRef('rangle/radius', 'basic-emotion', ['src','styles']),
    }
};

// type ListrTask = { title: string, task:Function }


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
                task: async () => {
                    await git.clone({
                        fs,
                        dir,
                        http: gitHttp,
                        url: `https://github.com/${ repoRef?.repo }`,
                        depth: 1,
                    });
                }
            },
            {
                title: 'Checkout the branch',
                task: async () => {
                    await git.checkout({
                        fs,
                        dir,
                        ref: repoRef?.branch,
                    });
                }
            }
        ]
        
        const styleDirOut = path.join(designSystemOptions['ds-name'],...repoRef?.styleDir); 
        const setupRepo = [
            {
                title: 'Copy Styles',
                task: async () => {
                    try {
                        await fsExtra.copy('styles', styleDirOut)
                        console.log('success!')
                    } catch (err) {
                        console.error(err)
                    }
                }
            },
        ]


        // setup the main tasks launcher
        // we seperate git from setting up the repo
        const tasks = new Listr([
            {
                title: 'Git setup',
                task: () => {
                    return new Listr(gitSetup, {concurrent: false});
                }
            },
            {
                title: 'Setup the template',
                task: () => {
                    return new Listr(setupRepo,{concurrent: false});
                }
            }
            
        ]);

        // run all of the commands
        await tasks.run().catch((err:any) => {
            console.log(chalk.red(err));
            return false;
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
