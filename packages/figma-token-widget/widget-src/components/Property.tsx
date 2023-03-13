const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, useEffect, waitForTask } = widget

const TokenColours = {
  token: '#368a0f',
  error: '#ff0000',
  default: '#666'
}

export function Property({ node }: { node: StyleNode }) {
  if (node.tokens.length === 0) return null
  return (
    <AutoLayout
      padding={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }}
      direction="vertical"
      name="Token"
    >
      {node.tokens.map((token, index) => {
        if (token.name === 'hash') return null
        return (
          <Text fill={TokenColours[token.type || 'default']} key={index}>{token.name} - {token.value}</Text>
        )
      })}
    </AutoLayout>
  )
}