# Structure #
There is 3 phases in which data passes through the app.
1. Import the data from Figma or the design tool.
2. Parse it into a universal Design Token list.
3. Export it as css or js to be used in the projects.

## Importing Data ##
Currently there is 3 ways of importing the design system. These all rely on Figma and require communications with Design to set the file up in the appropiate way.
The entry point is at 
command.ts > radius-styles.ts (generateGlobalStyles) > utils/figma.loader.ts (loadFile) > utils/figma.utils.ts (getTokens) > utils/common.utils.ts (groupByType)

### Figma parser 1 ###
A robust and static way of parsing the files.

### Figma parser 2 ###
A more module way to import Figma files. We are building out a way for users to add their own way of parsing Figma files because their Figma structure might not match our structure.

### Figma Publish parser ###
This requires the Figma project to be published.
Does not require a specific structure to be used.
Because the selected features are published, the data being parsed all the data should be directly related to Design Tokens.

## Parsing ##

?? JSON path technique ??


## Design Tokens ##
The structure of this is:
Grouped by token groups of "typography" | "color" | "spacing" | "breakpoint" | "grid" | "elevation"
Each of these have an array of design tokens.

A single token looks like this:
```
{
  type: 'color',
  name: 'name given in figma',
  token: `--${ name.toLowerCase().split('/').join('-') }`,
  value: colorToHex(color)
}
```
The token groups are an object of tokens.
```
{
  'typography':[
    { 'type':'typography'},
    { 'type':'typography'}
  ],
  'color':[
    { 'type':'color'},
    { 'type':'color'}
  ]
}
```


## Export CSS ## 
As css tokens



# Publishing #
## NPM ##
Publish to NPM

## Story Book ##
Automatic pipelines static hosting to github
Each component should be published
Publish the static pages to S3 or Github pages

## Chromatic ##
Publish to chromatic

## Artifactory ##
How to save

## Github pipeLines ##

## AWS pipeLines ##




# Example projects #
## Basic button checklist ##
Readonly
Disable
Aria Lables
Be able to ref the child
Loading state
Hover state
Icon
width - reactive vs 100% vs static
Alignment ( center )

# Packages #
There are a lot of packages that don't need to be included?

# duplicated build systems #
Remove the TSDX or rollup there should only be one building tool

