# Radius Command-line Interface

A modular tool to generate and manage Design Systems and other Accelerated Projects.

## Usage

```
npm -g i @radius/cli

radius <command> [options]

radius --help
```

## Available Commands:

### Styles

Generate/update styles for a Design System by reading design tokens directly from a Design Source like Figma

Example:

```
  radius styles http://link.to/figma/f0383de89 ../styles --template css-modules --single-file-output
```

See [lib/commands/styles](lib/commands/styles) for more information
