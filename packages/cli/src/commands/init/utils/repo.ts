import chalk from 'chalk';
import git from 'isomorphic-git';
import gitHttp from 'isomorphic-git/http/node';
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import Listr from 'listr';
import { logger } from '../../../logger';
import { execSync } from 'child_process';


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

const isKeyof = <T extends {}>(val: T) => {
  const keys = Object.keys(val);
  return (k: keyof never): k is keyof T => keys.includes(k as never);
};
const isReactStyle = isKeyof(REPOS.react);

export const commandSetupGit = async (dir: string) => {
  // check to see if Git exists
  try{
    await execSync('which git');
  } catch(error: any){
    console.log(chalk.red(error?.message));
  }

  // check to see if the folder we just cloned exists
  if(!fs.existsSync(dir)){
    throw new Error(`The repo directory ${ dir } does not exist`);
  }

  await execSync(`cd ${ dir } && rm -rf .git`);
  await execSync(`cd ${ dir } && git init main`);
};

export const logSuccess = (designSystemOptions: any) => {
  console.log('');
  logger.info('🚀 You are all set.');
  console.log('');
  logger.info('✨ Follow the below steps to run you design system.');
  console.log('');
  console.log(chalk.hex('#00FF00')(` - cd ${ designSystemOptions['ds-name'] }`));
  console.log(chalk.hex('#00FF00')(' - npm install'));
  console.log(chalk.hex('#00FF00')(' - npm run storybook'));
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
    return null;
  }
  return repoRef;
};


export const configureGitSetup = (
  dir: string,
  ref: BranchRef,
  clone: any,
  checkout: any,
  removeDir: any,
  removeGit: any
): { run: () => Promise<void> } => {

  const gitSetup = [
    {
      title: 'Check if folder is available',
      task: () => {
        if (fs.existsSync(dir)) {
          throw new Error(`The folder ${ dir } is already in use`);
        }
      }
    },
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
      title: 'Initializing git repository',
      task: () => removeGit(dir)
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
    const definitiveRef: BranchRef | null = repoRef;

    if(!definitiveRef){
      return false;
    }

    const tasks = configureGitSetup(
      dir,
      definitiveRef,
      git.clone,
      git.checkout,
      fsExtra.removeSync,
      commandSetupGit
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
