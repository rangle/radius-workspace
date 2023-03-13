


const propertiesToMatch = {
  opacity: {
    errorMessage: 'Opacity must be a token',
  },
  itemSpacing: {
    errorMessage: 'Item spacing must be a token',
  },
  padding: {
    errorMessage: 'Padding must be a token',
  },
  fill: {
    errorMessage: 'Fill must be a token',
  },
  stroke: {
    errorMessage: 'Stroke must be a token',
  },
  strokeWidth: {
    errorMessage: 'Stroke width must be a token',
  },
  cornerRadius: {
    errorMessage: 'Corner radius must be a token',
  },
  fontFamily: {
    errorMessage: 'Font family must be a token',
  },
  fontSize: {
    errorMessage: 'Font size must be a token',
  },
  fontWeight: {
    errorMessage: 'Font weight must be a token',
  },
  letterSpacing: {
    errorMessage: 'Letter spacing must be a token',
  },
  lineHeight: {
    errorMessage: 'Line height must be a token',
  },
}

export function validateSceneNode(node: SceneNode, tokens: StyleNodeTypes[], properties: StyleNodeTypes[]) {
  const errors: StyleNodeTypes[] = [];
  if (node.type === 'FRAME') {
    if (node.layoutMode === 'NONE') {
      errors.push({
        name: 'layoutMode',
        value: 'Layout mode must be set to auto layout',
        type: 'error'
      })
    }
  }



  // TODO: just because it has the tokens, doesn't mean that it's still being used
  // we should validate that the token is being used by loading all the values from the root property

  // tokens as a list of tokens names
  const tokenNames = tokens.map(token => token.name)

  properties.forEach(prop => {

    // check each properties to match and run the test
    Object.keys(propertiesToMatch).forEach(key => {
      if (prop.name === key && !tokenNames.includes(key)) {
        errors.push({
          name: key,
          value: propertiesToMatch[key as keyof typeof propertiesToMatch].errorMessage,
          type: 'error'
        })
      }
    })
    
  })

  return errors
}
