# Request for contributions #
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Your First Contribution ##
We follow [Github flow](https://docs.github.com/en/get-started/quickstart/github-flow) make descriptive branch names. Name the branche with `feature/<ticket or description>` or `bugfix/<ticket or description>`.

Don't forget to delete your branch after it's been merged!

## Project Structure ##
This repo contains the build tool to create a CLI that performs two tasks:
1. init - walks the user through cloning a git repo
2. styles - scrapes a Figma file finding colours, type, padding ...

The build tool is [Lerna](https://github.com/lerna/lerna) and TSC for the CLI module.

- TODO - How does the CLI work?

## Contributing Templates ##
- TODO - What structure should the content be?

## Testing ##
 - TODO - add instructions on how to add testing
 - TODO - what % of coverage does new code need to be added

## Coding Style ##
- TODO - Is there a typescript format that is considered standard


# User Journey #
There is 2 main Epic user stories
1. I'm a developer/designer looking to create a design system that is scaleable and is using best practices.
2. I'm looking to create a template to build design systems so that in the future we have a starting point to begin projects from.

## User flow ##
1. DEV - [Install the CLI from npm](#1-the-cli)
2. DEV - [CLI to bootstrap the project `radius init`](#2-bootstrap)
3. Design - [Clone Figma file and create/edit tokens](#3-figma)
4. Dev - [CLI to retrive styles from Figma](#4-styles-export)
5. Dev - [Uses the bootstraped project + styles to create the design system.](#5-create-your-design-system)
6. Dev & Design - [The bootstrapped project is setup to publish and test project with examples.](#6-publish)

### 1. The CLI ###
The CLI is generated from this [repository](https://github.com/rangle/radius-workspace)
* The CLI uses Lerna to bundle itself
* Lerna is a tool that can build multiple packages at a single time
* The package itself uses Typescript Compiler and Jest for testing
* 

### 2. Bootstrap ###
* Static list of project
* These are hard coded
* These are currently store in git

### 3. Figma ###
* Clone the repo
* Add/Update tokens to your design system
* List of currently accepted tokens

### 4. Styles Export ###
* `radius-script styles` Generates a file systems based off  
* These generate a folder with the design tokens

### 5. Create your design system ### 
* Create your components
* Test your components
* Follow example for best practices on testing

### 6. Publish ###
* Storybook
* npm
* demo project page
