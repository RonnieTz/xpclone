import { FileItem } from '../FolderContent/types';

export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export interface UseExplorerKeyboardProps {
  files: FileItem[];
  selectedFileIds: string[];
  lastSelectedIndex: number;
  viewMode: string;
  windowId?: string;
  itemPositions?: Record<string, { x: number; y: number }>;
  onFileSelect: (file: FileItem, event?: React.MouseEvent) => void;
  onFileDoubleClick: (file: FileItem) => void;
  onSelectAll: () => void;
}

export interface FileWithPosition {
  file: FileItem;
  index: number;
  x: number;
  y: number;
}
