const constraintsVertical = {
  'MIN': "top",
  'CENTER': "center",
  'MAX': "bottom",
  'STRETCH': "stretch",
  'SCALE': "scale",
  'SPACE_BETWEEN':'space between',
  'BASELINE':'baseline'
}
const constraintsHorizontal = {
  'MIN': "left",
  'CENTER': "center",
  'MAX': "right",
  'STRETCH': "stretch",
  'SCALE': "scale",
  'SPACE_BETWEEN':'space between',
  'BASELINE':'baseline'
}

const sizing = {
  'FIXED': "Fixed width",
  'AUTO': "Hug contents",
}

const layoutMode = {
  'NONE': "None",
  'HORIZONTAL': "Horizontal",
  'VERTICAL': "Vertical",
}

const textAlign = {
  'LEFT': "left",
  'CENTER': "center",
  'RIGHT': "right",
  'JUSTIFIED': "justified",
  'TOP': "top",
  'BOTTOM': "bottom",
}



function AddAutoBoxFeatures(node:FrameNode,props:Properties) {
  props.layoutMode = layoutMode[node.layoutMode] // layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL'

  if(node.layoutMode === 'HORIZONTAL') {
    // horizontal
    props.xSizing = sizing[node.primaryAxisSizingMode];
    props.ySizing = sizing[node.counterAxisSizingMode];

  } else {
    // vertical
    props.ySizing = sizing[node.primaryAxisSizingMode];
    props.xSizing = sizing[node.counterAxisSizingMode];

  }

  props.align = ` ${constraintsVertical[node.counterAxisAlignItems]} ${constraintsHorizontal[node.primaryAxisAlignItems]}`;
  
  props.itemSpacing = node.itemSpacing; //: number
}



function AddAbsolutePositionFeatures(node:RectangleNode|TextNode,props:Properties) {
  props.x = Math.floor(node.x*100)/100
  props.y = Math.floor(node.y*100)/100
  props.constraints = `${constraintsVertical[node.constraints.vertical]} ${constraintsHorizontal[node.constraints.horizontal]}`
}

export function getProperties(node: SceneNode) {
  const properties: Properties = {};

  const props: Properties = {}

  if (node.type === 'TEXT' || node.type === 'RECTANGLE') {
    // props.absoluteRenderBounds = node.absoluteRenderBounds //Rect | null // IDK what this does...
    if (node.constrainProportions) props.constrainProportions = 'contain';//node.constrainProportions // boolean

    
    props.layoutAlign = node.layoutAlign // 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT'

    if (node.layoutGrow) props.layoutGrow = node.layoutGrow // number

    props.layoutPositioning = node.layoutPositioning //'AUTO' | 'ABSOLUTE'
    
    if (node.layoutPositioning === 'ABSOLUTE') {
      AddAbsolutePositionFeatures(node,props)
    }
  }

  if (node.type === 'TEXT') {
    // this is not like CSS, this is aligning the text in the box, it's kinda absolute position in side the container, but not really
    props.textAlign = `${textAlign[node.textAlignVertical]} ${textAlign[node.textAlignHorizontal]}`

    // is a sub option
    props.textAutoResize = node.textAutoResize //: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE'
  }

  
  if (node.type === 'FRAME') {
    if (node.layoutMode === 'NONE') {
      return {}
    }
    // None is not autobox
    AddAutoBoxFeatures(node,props)

    props.padding = `${node.paddingLeft} ${node.paddingRight} ${node.paddingTop} ${node.paddingBottom}`; //: number

    if(node.itemReverseZIndex) props.itemReverseZIndex = 'reverse';//node.itemReverseZIndex; //: boolean
    if(node.strokesIncludedInLayout) props.strokesIncludedInLayout = 'true';//node.strokesIncludedInLayout; //: boolean
    if(node.layoutGrids.length) props.layoutGrids = JSON.stringify(node.layoutGrids); //: ReadonlyArray<LayoutGrid>
    if(node.gridStyleId) props.gridStyleId = node.gridStyleId; //: string
    if(node.clipsContent) props.clippedContent = 'hidden'; //: boolean
    if(node.guides.length) props.guides = JSON.stringify(node.guides); //: ReadonlyArray<Guide>    
  }

  if (node.type === 'TEXT' || node.type === 'RECTANGLE' || node.type === 'FRAME' ) {
    // props.constraints = node.constraints // only used for setting height and width
    if (node.rotation) props.rotation = Math.floor(node.rotation*100)/100 // number
    if (node.opacity !== 1) props.opacity = Math.floor(node.opacity*100)/100 //: number

    // for frames that are xSizing Hug contents, is width needed?
    props.width = Math.floor(node.width*100)/100
    props.height = Math.floor(node.height*100)/100
  }

  if (node.type === 'RECTANGLE' || node.type === 'FRAME') {

    if (node.cornerRadius) {
      // console.log(node.cornerRadius.valueOf())
      if(typeof node.cornerRadius === 'number') {
        props.cornerRadius = node.cornerRadius //: number | PluginAPI['mixed']
      } else {
        props.cornerRadius = 'multi value corner... '//node.cornerRadius[0] //: number | PluginAPI['mixed']
      }
      props.cornerSmoothing = node.cornerSmoothing //: number
    }
  }

  if (node.type === 'INSTANCE') {
    // if it's an instance...
  }

  return props;
}