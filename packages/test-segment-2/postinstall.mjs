import fs from 'fs/promises';

console.log(
  'Post install',
  process.env.npm_package_name,
  ':',
  process.env.npm_package_description
);

const targetProjectPath = process.env.radius_project_path ?? '';

fs.writeFile(
  `${ targetProjectPath }test-segment-2-post-install-output.txt`,
  `post install ran at ${ new Date().toISOString() },
  the path to the target project is '${ targetProjectPath }',
  ${ JSON.stringify(process.env, null, 2) }`
);

/**
 * If targetProjectPath exists, add/remove/change files in there are as part of the install process.
 * If targetProjectPath does not exist, do nothing.
 */