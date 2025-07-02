// Main component
export { default } from './FileItem';

// Hooks - using named exports
export { useCustomDragDrop } from './hooks/useCustomDragDrop';
export { useDragGhost } from './hooks/useDragGhost';
export { useDragHandling } from './hooks/useDragHandling';
export { useDropTargetDetection } from './hooks/useDropTargetDetection';
export { useFileDropOperations } from './hooks/useFileDropOperations';

// Types
export * from './types/dragDropTypes';

// Utils
export * from './utils/fileUtils';

// Views
export * from './views/FileViews';
