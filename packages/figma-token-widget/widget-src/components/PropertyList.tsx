
const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, useEffect, waitForTask } = widget

import {Property} from './Property'

export function PropertyList({ nodes, removeFunction }: { nodes: StyleNode[], removeFunction: (name: string) => void }) {
  return (
    <AutoLayout
      direction="vertical"
      name="NodeList"
      spacing={20}
    >
      {nodes.map((node, index) => (
        <AutoLayout
          direction="vertical"
          name="Node"
          key={index}
        >
          <Text
            onClick={() => removeFunction(node.id)}
            key={index}

          >{node.name} - {node.type} </Text>
          <Property node={node}></Property>
        </AutoLayout>
      ))}
    </AutoLayout>
  )
}
