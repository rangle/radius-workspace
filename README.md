# Radius #
The Radius design system starter kit is a collection of open-source tools and libraries that guide and help you to build your design system faster. Design systems need to match your brand and product needs, and your current and future digital workflows. Too much, too little, too complex, or too off-brand, and you will fight your design system as much as benefit from it.

## Background ##
There is mutliple aspects to this project, this build too, the artifact of a CLI command, the artifact of the CLI which is a template with added design system css.

Radius has a previous version that can be found [here]()

Radius has been an internal project of [Range.io](https://rangle.io)

More Details can be seen here on the official site [Rangle.io/radius](https://rangle.io/radius/)

The CLI clones 2 external repos -  a [react version](https://github.com/rangle/radius) - a [angular version](https://github.com/rangle/radius-angular), in the angular version, we have 3 branchs with different types of css frameworks.

## Contributing ##

PR template is taken from [here](https://embeddedartistry.com/blog/2017/08/04/a-github-pull-request-template-for-your-projects/)

## Licenses ##

## Architecture ##
This repo contains the build tool to create a CLI that performs 2 tasks:
1. init - walks the user through cloning a git repo
2. styles - scrapes a Figma file finding colours, type, padding ... and creates a folder of css modules which is added when init is called to the clonned repos

The build tool is [Lerna](https://github.com/lerna/lerna) at the top level, with tsc for the cli module.



## Acknowledgments ##
