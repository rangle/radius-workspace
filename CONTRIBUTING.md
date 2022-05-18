# Request for contributions

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Your First Contribution

We follow [Github flow](https://docs.github.com/en/get-started/quickstart/github-flow) make descriptive branch names. Name the branch with `feature/<ticket or description>` or `bugfix/<ticket or description>`.

Don't forget to delete your branch after it's been merged!

## Project Structure

This repo contains the build tool to create a CLI that performs two tasks:

1. init - walks the user through cloning a git repo
2. styles - scrapes a Figma file finding colours, type, padding ...

The build tool is [Lerna](https://github.com/lerna/lerna), TSC for the CLI module.

- TODO - How does the CLI work?

## Contributing Templates

To contribute a Design System template please include the following

1. A framework (React, Angular, Vue)
2. Example components (Keep it simple)
3. Unit testing of the components (Jest and Chromatic)
4. Means to publish (StoryBook, npm)
5. Documentation, what was implemented with examples of best practice

## Testing

- TODO - add instructions on how to add testing
- TODO - what % of coverage does new code need to be added

## Coding Style

- TODO - Is there a typescript format that is considered standard
