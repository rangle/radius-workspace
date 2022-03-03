# Radius #
The Radius design system starter kit is a collection of open-source tools and libraries that guide and help you to build your design system faster. Design systems need to match your brand and product needs, and your current and future digital workflows. Too much, too little, too complex, or too off-brand, and you will fight your design system as much as benefit from it.

## Background ##
This repo builds a CLI command, the CLI performs 2 tasks, gets styles from Figma and clones a git repo.

Radius has a previous version that can be found [here](https://github.com/rangle/radius)

More Details can be seen here on the official site [Rangle.io/radius](https://rangle.io/radius/)

The CLI clones 2 external repos -  a [react version](https://github.com/rangle/radius) - a [angular version](https://github.com/rangle/radius-angular), in the angular version, we have 3 branchs with different types of css frameworks.

## Contributing ##

## Licenses ##

## Architecture ##
This repo contains the build tool to create a CLI that performs 2 tasks:
1. init - walks the user through cloning a git repo
2. styles - scrapes a Figma file finding colours, type, padding ...

The build tool is [Lerna](https://github.com/lerna/lerna) and tsc for the cli module.

## Acknowledgments ##
PR template is taken from [here](https://embeddedartistry.com/blog/2017/08/04/a-github-pull-request-template-for-your-projects/)
