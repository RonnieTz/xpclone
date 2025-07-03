export interface DragState {
  isDragging: boolean;
  ghostElement: HTMLElement | null;
  originalPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  startMousePos: { x: number; y: number };
  dragOffset: { x: number; y: number };
}

export interface DropTarget {
  type: 'desktop' | 'folder' | 'taskbar';
  path: string;
  windowId?: string;
}

export interface DragData {
  id: string;
  name: string;
  type:
    | 'file'
    | 'folder'
    | 'application'
    | 'shortcut'
    | 'program'
    | 'image'
    | 'sound'
    | 'drive';
  path?: string;
}

export interface UnifiedItemData {
  id: string;
  name: string;
  type:
    | 'file'
    | 'folder'
    | 'application'
    | 'shortcut'
    | 'program'
    | 'image'
    | 'sound'
    | 'drive';
  path?: string;
  icon?: string;
  extension?: string;
  size?: number;
  lastModified?: Date;
}

export interface DragEndEvent {
  dropTarget: DropTarget | null;
  upEvent: MouseEvent;
  dragOffset: { x: number; y: number };
}

export interface DragMonitor {
  isDragging(): boolean;
  getItem(): UnifiedItemData | null;
  getDropResult(): DropTarget | null;
  canDrop(): boolean;
  isOver(): boolean;
  getClientOffset(): { x: number; y: number } | null;
  getDifferenceFromInitialOffset(): { x: number; y: number } | null;
}

export interface DropMonitor {
  canDrop(): boolean;
  isOver(): boolean;
  getItem(): UnifiedItemData | null;
  getItemType(): string | symbol | null;
}

export interface DragPreviewOptions {
  captureDraggingState?: boolean;
  anchorX?: number;
  anchorY?: number;
}

export interface DropTargetHookSpec {
  accept: string | string[];
  drop?: (
    item: UnifiedItemData,
    monitor: DropMonitor
  ) => DropTarget | undefined;
  hover?: (item: UnifiedItemData, monitor: DropMonitor) => void;
  canDrop?: (item: UnifiedItemData, monitor: DropMonitor) => boolean;
  collect?: (monitor: DropMonitor) => Record<string, unknown>;
}

export interface UseUnifiedDragDropProps {
  item: UnifiedItemData;
  context: 'desktop' | 'folder';
  viewMode?: 'icons' | 'list' | 'details' | 'thumbnails';
  currentPath?: string;
  windowId?: string;
  onSelect?: (event?: React.MouseEvent<HTMLElement>) => void;
  onMove?: (x: number, y: number) => void;
}
