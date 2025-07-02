import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { DropTarget } from '../types/dragDropTypes';

export const useDropTargetDetection = (
  windowId?: string,
  currentPath?: string
) => {
  // Get all open windows to detect drop targets
  const windows = useSelector((state: RootState) => state.windows.windows);

  // Find what's under the cursor when dropping
  const findDropTarget = useCallback(
    (x: number, y: number): DropTarget | null => {
      // Get the element at the cursor position, excluding the dragged item
      const elementsAtPoint = document.elementsFromPoint(x, y);

      // Filter out the dragged element and ghost
      const validElements = elementsAtPoint.filter(
        (el) => !el.classList.contains('dragging-ghost')
      );

      // Check each element in z-index order (top to bottom)
      for (const element of validElements) {
        // Check if dropping on another Explorer window's folder content area
        const folderContent = element.closest('[data-folder-content]');
        if (folderContent) {
          const targetWindowId = folderContent.getAttribute(
            'data-folder-content'
          );
          const targetPath = folderContent.getAttribute('data-folder-path');

          if (targetWindowId && targetPath) {
            if (targetWindowId === windowId && targetPath === currentPath) {
              return { type: 'same-folder', path: currentPath };
            } else {
              return {
                type: 'folder',
                path: targetPath,
                windowId: targetWindowId,
              };
            }
          }
        }

        // Check if dropping on a folder item within the current folder
        const fileItem = element.closest('[data-file-item]');
        if (fileItem) {
          const fileType = fileItem.getAttribute('data-file-type');
          const fileId = fileItem.getAttribute('data-file-id');

          if (fileType === 'folder' && fileId) {
            // Get the folder's path from the file system
            const folderElement = fileItem as HTMLElement;
            const folderName = folderElement.textContent?.trim();
            if (folderName && currentPath) {
              const targetPath = `${currentPath}\\${folderName}`;
              return {
                type: 'folder',
                path: targetPath,
                windowId,
              };
            }
          }
        }

        // Check if dropping on an Explorer window (but not in folder content area)
        const explorerWindow = element.closest('[data-window-id]');
        if (explorerWindow) {
          const targetWindowId = explorerWindow.getAttribute('data-window-id');
          if (targetWindowId) {
            // Find the window in Redux to get its content
            const targetWindow = windows.find((w) => w.id === targetWindowId);
            if (targetWindow) {
              if (targetWindow.content.includes('Folder:')) {
                const folderPath = targetWindow.content.replace('Folder: ', '');
                return {
                  type: 'folder',
                  path: folderPath,
                  windowId: targetWindowId,
                };
              } else if (targetWindow.content === 'My Computer') {
                return {
                  type: 'folder',
                  path: 'C:\\',
                  windowId: targetWindowId,
                };
              }
            }
          }
        }

        // Check if dropping on desktop (only if no other targets found)
        if (
          element.hasAttribute('data-desktop') ||
          element.closest('[data-desktop]')
        ) {
          return {
            type: 'desktop',
            path: 'C:\\Documents and Settings\\Administrator\\Desktop',
          };
        }
      }

      return null;
    },
    [windows, windowId, currentPath]
  );

  return { findDropTarget };
};
