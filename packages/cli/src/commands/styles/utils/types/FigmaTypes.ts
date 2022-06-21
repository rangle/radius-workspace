import { StyleMetadata, ComponentMetadata } from 'figma-api/lib/api-types';
import { DesignToken, NodeRoot } from '../figma.utils';

export type StyleResponse = {
  meta: {
    styles: StyleDescriptor[],
  },
};
export type StyleDescriptor = {
  key: string,
  file_key: string,
  node_id: string,
  style_type: string,
  thumbnail_url: string,
  name: string,
  description: string,
  created_at: string,
  updated_at: string,
  user: User,
  sort_position: string,
};

export type User = {
  id: string,
  handle: string,
  img_url: string,
};
  
export type GetStylesListType = {
  nodes: string[],
  styles: {
    [key: string]: StyleMetadata,
  },
};
  
export type FigmaStyle = {
  [key: string]: StyleMetadata, 
};
  
export type DesignTokenFilter = (
  component: ComponentMetadata, 
  node: NodeRoot
) => DesignToken|DesignToken[]|undefined;

export  type NodeFilter = (
  component: ComponentMetadata, 
  data: NodeRoot, 
  node: DesignTokenFilter
) => DesignToken|DesignToken[]|undefined;