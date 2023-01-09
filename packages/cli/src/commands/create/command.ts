import { mkdirp } from 'fs-extra';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { CommandModule } from 'yargs';
import path from 'path';
import { logger } from '../../logger';

import * as inquirer from './utils/inquirer';

const spawnWithAPromise = (command: string, args: string[], options: SpawnOptionsWithoutStdio) => {

  return new Promise((resolve) => {

    const ls = spawn(command, args, options );

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data.toString());
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
      // reject(data);
    });

    ls.on('exit', function (code) {
      console.log('child process exited with code ' + code);
      resolve(code);
    });

  });

};

type Options = {};

export const create: CommandModule<Options, Options> = {
  command: 'create',
  describe: 'Create a DS starter (segment version)',

  builder: (yargs) => {
    return yargs;
  },

  handler: async () => {
    logger.info(
      '💿 Welcome to Radius with Segments! Let\'s get you set up with a new project.\n\r'
    );
    const designSystemOptions = await inquirer.askForDesignSystemOptions();
    console.log('chosen options', designSystemOptions);

    const dir = `packages/${ designSystemOptions['ds-name'] }`;
    const packageList = designSystemOptions.segments.map((packageName: string) => packageName + '@*');

    console.log('project dir:', dir);
    console.log('package list:', packageList);

    // postinstall scripts can't assume the project is located at '../' since I'm working in a monorepo right now
    // trailing '/' is included on the path to simplify code in packages, but it will get more complex eventually
    process.env.radius_project_path = '/' + path.relative('/', `./${ dir }`) + '/';

    console.log('radius project path:',process.env.radius_project_path);

    console.info('making directory', dir);
    await mkdirp(dir);
    console.info('made directory', dir);

    console.info('yarn init');
    const initResult = await spawnWithAPromise('yarn', ['init', '--yes'], { cwd: dir });
    console.info('yarn init result', initResult);

    console.info('yarn install');
    const installResult = await spawnWithAPromise('yarn', ['add', ...packageList], { cwd: dir });
    console.info('yarn install result', installResult);

  }
};
