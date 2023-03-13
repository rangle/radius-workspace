type StyleNodeTypes = {
  name: string;
  value: string;
  type?: 'token' | 'error' | 'default'
  shouldBeToken?: boolean;
}
type StyleNode = {
  name: string;
  type: string;
  id: string;
  tokens: StyleNodeTypes[]
}

type Properties = WidgetJSX.LayoutProps & WidgetJSX.GeometryProps & {
  [key: string]: string | number | undefined;

  // the atuolayout props from our git repo
  absolutePosition?: string;
  direction?: string;
  space?: string;
  clippedContent?: string;
  alignment?: string;
  width?: string|number;
  height?: string|number;
  padding?: string;
  opacity?: string|number;
  x?: string|number;
  y?: string|number;
  horizontalConstraint?: string;
  verticalConstraint?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  strokeAlign?: string;
  cornerRadius?: string|number;
  effect?: string;
}