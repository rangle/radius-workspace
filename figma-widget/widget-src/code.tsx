// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, useEffect, waitForTask } = widget

import { PropertyList } from './components/PropertyList'
import {findToken} from './tokenGenerator'

function Widget() {
  const [styleNodes, setStyleNodes] = useSyncedState('styleNodes', [] as StyleNode[])
  const [selectedNode, setSelectedNode] = useSyncedState('selectedNode', null as SceneNode | null)
  const [selectNodeActive, setSelectNodeActive] = useSyncedState('selectNodeActive', false)

  function getTokens(node:SceneNode) {
    if (!node) return
    if(node.type === 'WIDGET') {
      console.log('woops you have selected a widget, did you mean to do this?')
      return
    }
    setSelectedNode(node);
    setStyleNodes(findToken(node, []));
  };

  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'select',
        tooltip: 'Select node',
        icon: `<svg width="18" height="18" fill="${selectNodeActive?'#999':'#fff'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 0c17.7 0 32 14.3 32 32V42.4c93.7 13.9 167.7 88 181.6 181.6H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H469.6c-13.9 93.7-88 167.7-181.6 181.6V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V469.6C130.3 455.7 56.3 381.7 42.4 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H42.4C56.3 130.3 130.3 56.3 224 42.4V32c0-17.7 14.3-32 32-32zM107.4 288c12.5 58.3 58.4 104.1 116.6 116.6V384c0-17.7 14.3-32 32-32s32 14.3 32 32v20.6c58.3-12.5 104.1-58.4 116.6-116.6H384c-17.7 0-32-14.3-32-32s14.3-32 32-32h20.6C392.1 165.7 346.3 119.9 288 107.4V128c0 17.7-14.3 32-32 32s-32-14.3-32-32V107.4C165.7 119.9 119.9 165.7 107.4 224H128c17.7 0 32 14.3 32 32s-14.3 32-32 32H107.4zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
        </svg>`,
      },
      {
        itemType: 'action',
        propertyName: 'refresh',
        tooltip: 'Refresh the selected info',
        icon: `<svg width="18" height="18" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Free 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. -->
        <path d="M89.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L370.3 160H320c-17.7 0-32 14.3-32 32s14.3 32 32 32H447.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L398.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C57.2 122 39.6 150.7 28.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM23 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L109.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H32.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
        </svg>
        `,
      },
    ],
    ({propertyName, propertyValue}) => {
      switch (propertyName) {
        case 'select':
          waitForTask(new Promise(resolve => {
            setSelectNodeActive(true);
            // wait for the user to select a new node
            const selectNewNode = () => {
              setSelectNodeActive(false);
              // get the selected node
              getTokens(figma.currentPage.selection[0]);
              // remove the listener
              figma.off("selectionchange", selectNewNode);
              // resolve the task
              resolve(true);
            }
            figma.on("selectionchange", selectNewNode);
          }));
          break;
        case 'refresh':
          if(selectedNode){
            const foundTarget = figma.getNodeById(selectedNode.id) as SceneNode;
            if(foundTarget){
              getTokens(foundTarget);
              return;
            }
          }
          setStyleNodes([]);
          break;
        
      }
    },
  )

  const removeFromList = (id: string) => {
    setStyleNodes(styleNodes.filter((item) => item.id !== id))
  }




  return (
    <AutoLayout
      verticalAlignItems={'center'}
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={'#FFFFFF'}
      stroke={'#E6E6E6'}
      strokeWidth={1}
      direction="vertical"

    >
      <PropertyList nodes={styleNodes} removeFunction={removeFromList}></PropertyList>


    </AutoLayout>
  )
}

widget.register(Widget)
