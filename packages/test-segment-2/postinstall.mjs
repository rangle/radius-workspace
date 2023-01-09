import fs from "fs/promises";

console.log(
  "Post install",
  process.env.npm_package_name,
  ":",
  process.env.npm_package_description
);

fs.writeFile(
  `${process.env.radius_project_path}test-segment-2-post-install-output.txt`,
  `post install ran at ${new Date().toISOString()},
  ${JSON.stringify(process.env, null, 2)}`
);
