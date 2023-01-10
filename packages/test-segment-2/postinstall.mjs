import fs from 'fs/promises';

console.log(
  'Post install',
  process.env.npm_package_name,
  ':',
  process.env.npm_package_description
);

const basePath = process.env.radius_project_path ?? '';

fs.writeFile(
  `${ basePath }test-segment-2-post-install-output.txt`,
  `post install ran at ${ new Date().toISOString() },
  ${ JSON.stringify(process.env, null, 2) }`
);
