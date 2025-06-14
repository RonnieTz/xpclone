export interface ExplorerProps {
  path?: string;
  type?:
    | 'folder'
    | 'my-computer'
    | 'recycle-bin'
    | 'my-documents'
    | 'my-music'
    | 'control-panel'
    | 'internet-explorer';
}

export interface DropdownPosition {
  x: number;
  y: number;
}

export type MenuType =
  | 'File'
  | 'Edit'
  | 'View'
  | 'Favorites'
  | 'Tools'
  | 'Help';
