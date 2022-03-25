# Radius Style Generator

Style format (Figma api, Sketch, Adobe xd) `>>>>` Universal format `>>>>` Output to css and js files 

## Fgiam Parser ##
The api provides 2 general sections - the document, which is all the nodes that the figma users interact with - and then components, componentSets, styles < these reference the document with labeling the elements in the document as a component, component set or style (not the main window).

The designers must stick to strick data structures for their content.

Features to be created:
*<strong>Fonts</strong> - weight, spacing,  
*<strong>Color</strong> - 
*<strong>Spacing</strong> - 

How we retrive the styles - 3 ways:
1. Directly from the Document (what the designers edit)
2. From the Style list, this is the "Classes" designers can use to style components quickly - editing the "Class" changes all styles. The class key is used to look up the style from the document.
3. From the component/component sets. For component sets - this flags to the developers that there is multiple sub styles for this feature. Font-size has multiple sizes, but we also have Font-weight. When refrencing the component sets, these refrecne specific components that we then look up in the document.

## Middle data
Make sure the structure doesn't contain CSS => dropshadow is a gotchya
All font sizes should be considered as multipliers of the base font size

## Export
Font size needs to be considered slightly different, how do we scale

We should export the tokens as all the tokens

We should export sets of tokes (atoms) (page header, paragraph) - we should be able to manage type well, but not more specific components.


<!-- Sets weight, spacing, >>>> all variants small, med, large >>>> map to the component on the page

Get child style Nodes
is component to help choose if it style or component def

Node Document is the doc (the HTML/content)

Base Def is the components

Node Def  

Generate Tokes V2 >>>>> filter Generate Typographies -->


## Usage

```
radius styles . --source figma --template css-modules
```
