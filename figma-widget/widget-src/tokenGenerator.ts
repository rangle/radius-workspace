import { getProperties } from "./properties";
import { formatKey } from "./utils/tokenNaming";
import { validateSceneNode } from "./validator";

const mapTokenType = (token: string) => {
  if(token === 'fill') return 'color'
  if(token === 'stroke') return 'color'
  return token
}

// an iterator to find all the tokens and nodes in the selection
// for the current node, we collect it's tokens, and properties
// then compare the tokens to properties to see if we need to show an error
// we return all all the properties, tokens and errors in the tokens field for the new node.
// then we iterate over it's children and do the same
// we return the list of nodes so we can update the UI
export function findToken(node: SceneNode, localNodes: StyleNode[]) {
  // console.log(node)

  const newNode: StyleNode = {
    name: node.name,
    type: node.type,
    id: node.id,
    tokens: []
  }

  const tokens:StyleNodeTypes[] = []
  const properties:StyleNodeTypes[] = Object.entries(getProperties(node)).map(prop => {return{name:prop[0], value:(prop[1]||'') as string}})


  // These tokens are from figma tokens plugin
  // They share the data via the sharedPluginData namespace "tokens"
  // We can get the list of tokens applied to the current node
  const sharedTokens = node.getSharedPluginDataKeys("tokens");
  if (sharedTokens.length > 0) {
    sharedTokens.forEach(token => {
      if(token === 'version') return; // version I think is a reserved key for telling the plugin what version of the tokens it is using
      
      let value = node.getSharedPluginData("tokens", token)
      // TODO: this does not match the current implementation of tokens
      // We might not have enough context to know the proper title of the token
      value = `--${mapTokenType(token)}-${formatKey(value)}`
      tokens.push({
        name: token,
        value: value,
        type: 'token'
      })
    });
  }

  // We compare the found tokens vs the properties to see if we need to show an error
  const errors:StyleNodeTypes[] = validateSceneNode(node,tokens,properties);

  // TODO: We probably want to add a step, where we merge the tokens and properties

  // combine all the collected tokens and properties and errors
  newNode.tokens = [...tokens, ...properties, ...errors]

  // add to the list of nodes we show in the UI
  const existingNode = localNodes.find(styleNode => styleNode.id === node.id)
  if (existingNode) {
    // update the existing node
    const index = localNodes.indexOf(existingNode)
    localNodes[index] = newNode
  } else {
    // add the new node
    localNodes.push(newNode)
  }

  // iterate over the array of shared tokens getting their value
  if ('children' in node) {
    node.children.forEach(child => {
      localNodes = findToken(child, localNodes)
    })
  }
  return localNodes
}