export interface UseCustomDragDropProps {
  file: {
    id: string;
    name: string;
    type: string;
    path: string;
  };
  viewMode: string;
  windowId?: string;
  currentPath: string;
  onMove?: (x: number, y: number) => void;
  onSelect?: (e: React.MouseEvent) => void;
}

export interface DragState {
  isDragging: boolean;
  draggedElement: HTMLElement | null;
  originalPosition: { x: number; y: number } | null;
  startMousePos: { x: number; y: number };
  dragOffset: { x: number; y: number };
}

export interface DropTarget {
  type: 'folder' | 'desktop' | 'same-folder';
  path: string;
  windowId?: string;
}
