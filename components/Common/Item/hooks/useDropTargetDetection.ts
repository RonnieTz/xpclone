import { useCallback } from 'react';

export const useDropTargetDetection = (
  windowId?: string,
  currentPath?: string
) => {
  const detectDropTarget = useCallback(
    (event: MouseEvent) => {
      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element) return null;

      // Check for folder content drop FIRST (more specific)
      const folderContent = element.closest('[data-drop-target="folder"]');
      if (folderContent) {
        // Get the actual folder path from the target element's data attributes
        const targetFolderPath = folderContent.getAttribute('data-folder-path');
        const targetWindowId = folderContent.getAttribute(
          'data-folder-content'
        );

        if (targetFolderPath) {
          return {
            type: 'folder' as const,
            path: targetFolderPath,
            windowId: targetWindowId || windowId,
          };
        }
      }

      // Check for taskbar drop
      const taskbar = element.closest('[data-drop-target="taskbar"]');
      if (taskbar) {
        return {
          type: 'taskbar' as const,
          path: 'taskbar',
        };
      }

      // Check for desktop drop LAST (most general)
      const desktopArea = element.closest('[data-drop-target="desktop"]');
      if (desktopArea) {
        return {
          type: 'desktop' as const,
          path: 'C:\\Documents and Settings\\Administrator\\Desktop',
        };
      }

      return null;
    },
    [currentPath, windowId]
  );

  const handleDropTargetChange = useCallback(
    (newTarget: ReturnType<typeof detectDropTarget>) => {
      // Handle visual feedback for drop target changes
      if (newTarget) {
        // Add visual feedback logic here
      }
    },
    []
  );

  return {
    detectDropTarget,
    handleDropTargetChange,
  };
};
