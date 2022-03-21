import chalk from 'chalk';
import git from 'isomorphic-git';
import gitHttp from 'isomorphic-git/http/node';
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import Listr from 'listr';
import { logger } from '../../../logger';
import { exec } from 'child_process';

export const asyncExec = (command: string) =>{
  return new Promise( (resolve) => {
    exec(command, (error: any, stdout) => {
      if(error){
        throw new Error(error);
      }
      if(stdout){
        return resolve({ state:'responce',message:stdout });
      }
      resolve({ state:'responce',message:null });
    });
  });
};
type BranchRef = { repo: string, branch: string };
const branchRef = (repo: string, branch: string): BranchRef => ({
  repo,
  branch
});
const REPOS = {
  angular: branchRef('rangle/radius-angular', 'main'),
  react: {
    css: branchRef('rangle/radius', 'basic-css'),
    'styled-components': branchRef('rangle/radius', 'basic-styled'),
    emotion: branchRef('rangle/radius', 'basic-emotion')
  }
};

const isKeyof = <T>(val: T) => {
  const keys = Object.keys(val);
  return (k: keyof never): k is keyof T => keys.includes(k as never);
};
const isReactStyle = isKeyof(REPOS.react);

export const logSuccess = (designSystemOptions: any) => {
  console.log(chalk.green('All done!'));
  console.log('');
  console.log(chalk.green('Follow the below steps to run:'));
  console.log(chalk.green(` - cd ${ designSystemOptions['ds-name'] }`));
  console.log(chalk.green(' - npm install'));
  console.log(chalk.green(' - npm run storybook'));
};

export const logFailure = (error: any) => {
  console.log(chalk.red('Couldn\'t clone the repo.'));
  console.log(chalk.red(error?.message));
};

export const selectRepo = (designSystemOptions: any) => {
  let repoRef: BranchRef | null = null;

  if (designSystemOptions['ds-framework'] === 'angular') {
    repoRef = REPOS.angular;
  } else if (designSystemOptions['ds-framework'] === 'react') {
    const reactStyle = designSystemOptions['ds-react-style'];
    if (!isReactStyle(reactStyle)) {
      throw new Error(`Expected a supported react style, got: ${ reactStyle }`);
    }
    repoRef = REPOS.react[reactStyle];
  }

  if (!repoRef) {
    logger.info('coming soon... 😉');
    return false;
  }
  return repoRef;
};

export const configureGitSetup = (
  dir: string,
  ref: any,
  clone: any,
  checkout: any,
  removeDir: any
): { run: () => Promise<void> } => {

  const gitSetup = [
    {
      title: 'Clone the repo',
      task: (_ctx: any, task: any) =>
        clone({
          fs,
          dir,
          http: gitHttp,
          url: `https://github.com/${ ref.repo }`,
          depth: 1
        }).catch((err: any) => {
          removeDir(dir);
          task.skip('Git failed.');
          throw new Error(err);
        })
    },
    {
      title: 'Checkout the branch',
      task: (task: any) =>
        checkout({
          fs,
          dir,
          ref: ref.branch
        }).catch((err: any) => {
          removeDir(dir);
          task.skip('Checkout out the branch failed.');
          throw new Error(err);
        })
    },
    {
      title: 'Remove .git',
      task: async () =>{
        const response = await asyncExec(`cd ${ dir } && rm -rf .git`);
        console.log(response);
      }
    },
    {
      title: 'Setup new git respository',
      task: async () =>{
        const response = await asyncExec('git init');
        console.log(response);
      }
    }
  ];

  // setup the main tasks launcher
  const tasks = new Listr(gitSetup, { concurrent: false });
  return tasks;
};

export const cloneRepo = async (designSystemOptions: any): Promise<boolean> => {
  try {
    const repoRef = selectRepo(designSystemOptions);
    const dir = path.join(process.cwd(), designSystemOptions['ds-name']);
    const definitiveRef: BranchRef | boolean = repoRef;

    const tasks = configureGitSetup(
      dir,
      definitiveRef,
      git.clone,
      git.checkout,
      fsExtra.removeSync
    );
    // run all of the commands
    await tasks.run();

    logSuccess(designSystemOptions);
    return true;
  } catch (error: any) {
    logFailure(error);
    return false;
  }
};
