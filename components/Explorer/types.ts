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
  windowId?: string; // Add windowId to allow Explorer to close its parent window
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

export type ExplorerBarState =
  | 'Default'
  | 'Search'
  | 'Favorites'
  | 'History'
  | 'Folders';
