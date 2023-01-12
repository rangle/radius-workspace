import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';
// import packageMerge from 'package-json-merge';
import glob from 'globby';

console.log(
  'Pre install',
  process.env.npm_package_name,
  ':',
  process.env.npm_package_description
);

const targetProjectPath = process.env.radius_project_path ?? '';
if (!targetProjectPath) process.exit();


if (fsExtra.existsSync(process.env.radius_project_path + 'index.html')) {
  console.warn('vite has been set up already. Exiting preinstall script');
  process.exit();
}

// copy some files and directories from this project starter to the new project
const thingsToCopy = await glob('**/!(package*|postinstall*|preinstall*|node_modules|)');

for (let i = 0; i < thingsToCopy.length; i += 1) {
  await fsExtra.copy(thingsToCopy[i], targetProjectPath + thingsToCopy[i]);
}

/**
 * move parts of package-original.json to the new project
 *
 * Questions:
 * 1. do I need to lock package.json while I do this so other preinstall/postinstall scripts can't modify it while this is running?
 *    how would I make other scripts wait until the file is unlocked?
 *
 * 2. does this before every `yarn` run in the project, messing up stuff? How do I make this only run once?
 *    can I prevent that, or is it better to pick another mechanism entirely?
 */

const originalPackageJsonContents = await fsExtra.readFile('package-original.json');
const { dependencies, devDependencies, peerDependencies, scripts } = JSON.parse(originalPackageJsonContents);

const targetProjectPackageJsonFilePath = `${ targetProjectPath }package.json`;
const newPackageJsonContents = await fsExtra.readFile(targetProjectPackageJsonFilePath);
const newPackage = JSON.parse(newPackageJsonContents);

const mergedPackageJsonContents = {
  ...newPackage,
  scripts: {
    ...newPackage.scripts,
    ...scripts
  },
  dependencies: {
    ...newPackage.dependencies,
    ...dependencies
  },
  peerDependencies: {
    ...newPackage.peerDependencies,
    ...peerDependencies
  },
  devDependencies: {
    ...newPackage.devDependencies,
    ...devDependencies
  }
};

await fsExtra.writeFile(targetProjectPackageJsonFilePath, JSON.stringify(mergedPackageJsonContents, null, 2));



fs.writeFile(
  `${ targetProjectPath }${ process.env.npm_package_name }-2-pre-install-output.txt`,
  `preinstall ran at ${ new Date().toISOString() },
  the path to the target project is '${ targetProjectPath }',
  ${ JSON.stringify(process.env, null, 2) }`
);