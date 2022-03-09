import { generateGlobalStyles } from "./commands/styles/lib/radius-styles";
import 'dotenv/config';

// To run in debug mode, add figma file url (located in package.json scripts -> cli: styles)
const url = 'https://www.figma.com/file/TJzz7ZB6pJvpLhjI5DWG3F/Radius-Design-Kit-V2(WIP)?node-id=725%3A8261';
const dryRun = false;
const template = 'css-modules';

// Assign user token 
const userToken = process.env["FIGMA_TOKEN"];
const outputDir = '';

// Funciton called by yargs script to generate styles
generateGlobalStyles({
    url,
    dryRun,
    template,
    userToken,
    outputDir,
});