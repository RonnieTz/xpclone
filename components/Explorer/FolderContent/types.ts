export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  dateModified?: Date;
  icon?: string;
  path: string;
  // Add position properties for drag and drop
  x?: number;
  y?: number;
}

// Interface for tracking custom positions within a folder
export interface FolderItemPosition {
  fileId: string;
  x: number;
  y: number;
}

export type ViewMode = 'icons' | 'list' | 'details' | 'thumbnails';

export interface FolderContentProps {
  files?: FileItem[];
  viewMode?: ViewMode;
  onFileDoubleClick?: (file: FileItem) => void;
  onFileSelect?: (file: FileItem, event?: React.MouseEvent) => void;
  onBackgroundClick?: () => void; // Add callback for background clicks
  selectedFileIds?: string[];
  windowId?: string; // Add windowId prop
  // Add props for drag and drop positioning
  onFileMove?: (fileId: string, x: number, y: number) => void;
  itemPositions?: Record<string, { x: number; y: number }>; // Change from Map to Record for Redux compatibility
  currentPath?: string; // Add currentPath prop
}

export interface FileItemProps {
  file: FileItem;
  viewMode: ViewMode;
  onDoubleClick?: () => void;
  onSelect?: (event?: React.MouseEvent) => void;
  isSelected?: boolean;
  windowId?: string; // Add windowId prop
  // Add props for drag and drop
  onMove?: (x: number, y: number) => void;
  position?: { x: number; y: number };
  currentPath?: string; // Add currentPath prop
}
