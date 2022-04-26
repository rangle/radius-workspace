# Radius Command-line Interface

A modular tool to generate and manage Design Systems and other Accelerated Projects.

## Usage

## Available Commands:

Global installation:

```
npm -g i @radius/cli

radius <command> [options]

radius --help
```

### Styles

Generate/update styles for a Design System by reading design tokens directly from a Design Source like Figma

Example:

```
  radius styles <FIGMA_URL> ../styles --template css-modules --single-file-output
```

See [lib/commands/styles](lib/commands/styles) for more information
