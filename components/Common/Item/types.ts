export interface UnifiedItemData {
  id: string;
  name: string;
  icon?: string;
  type:
    | 'file'
    | 'folder'
    | 'application'
    | 'shortcut'
    | 'program'
    | 'image'
    | 'sound'
    | 'drive';
  size?: number;
  dateModified?: Date;
  path?: string;
  // Position for drag & drop
  x?: number;
  y?: number;
}

export interface UnifiedItemProps {
  item: UnifiedItemData;
  context: 'desktop' | 'folder';
  viewMode?: 'icons' | 'list' | 'details' | 'thumbnails';
  isSelected?: boolean;
  position?: { x: number; y: number };

  // Event handlers
  onSelect?: (event?: React.MouseEvent<HTMLElement>) => void;
  onDoubleClick?: () => void;
  onMove?: (x: number, y: number) => void;

  // Context-specific styling
  className?: string;
  style?: React.CSSProperties;

  // New props for unified drag and drop
  currentPath?: string;
  windowId?: string;
}

export interface ItemRenderProps {
  item: UnifiedItemData;
  context: 'desktop' | 'folder';
  viewMode: 'icons' | 'list' | 'details' | 'thumbnails';
  isSelected: boolean;
  getIconSrc: () => string;
  getIconSize: () => { width: number; height: number };
}
