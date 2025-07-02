import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { moveItemToPath } from '@/lib/filesystem';
import { refreshExplorerWindows } from '@/lib/slices/windowsSlice';
import { refreshDesktopFromFileSystem } from '@/lib/slices/desktopSlice';
import { removeItemPosition } from '@/lib/slices/folderPositionsSlice';
import { DropTarget } from '../types/dragDropTypes';

interface UseFileDropOperationsProps {
  file: {
    id: string;
    name: string;
    type: string;
    path: string;
  };
  currentPath: string;
  onMove?: (x: number, y: number) => void;
  windowId?: string; // Add windowId to props
}

// Utility function to normalize folder paths for consistent storage
const normalizeFolderPath = (path: string): string => {
  if (!path) return '';
  // Remove trailing slashes and normalize backslashes
  return path
    .replace(/[\\\/]+$/, '')
    .replace(/\//g, '\\')
    .trim();
};

export const useFileDropOperations = ({
  file,
  currentPath,
  onMove,
  windowId, // Add windowId parameter
}: UseFileDropOperationsProps) => {
  const dispatch = useDispatch();

  const handleFileDrop = useCallback(
    (
      dropTarget: DropTarget | null,
      upEvent: MouseEvent,
      dragOffset: { x: number; y: number }
    ) => {
      if (dropTarget && dropTarget.path !== currentPath) {
        // Move file to different location
        const success = moveItemToPath(file.id, dropTarget.path);

        if (success) {
          // Remove position from old folder (using normalized path)
          dispatch(
            removeItemPosition({
              folderPath: currentPath,
              fileId: file.id,
            })
          );

          // Store exact drop position for the target location
          if (dropTarget.type === 'desktop') {
            // Folder-to-Desktop: Store position for desktop
            const desktopRect = document
              .querySelector('[data-desktop]')
              ?.getBoundingClientRect();
            if (desktopRect) {
              // Use the drag offset to position exactly where the mouse was
              const relativeX =
                upEvent.clientX - desktopRect.left - dragOffset.x;
              const relativeY =
                upEvent.clientY - desktopRect.top - dragOffset.y;

              const positionKey = `pendingDropPosition_${
                file.id
              }_${Date.now()}`;
              sessionStorage.setItem(
                positionKey,
                JSON.stringify({
                  name: file.name,
                  id: file.id,
                  x: Math.max(0, relativeX),
                  y: Math.max(0, relativeY),
                })
              );

              // Refresh desktop after a small delay
              setTimeout(() => {
                dispatch(refreshDesktopFromFileSystem());
              }, 10);
            }
          } else if (dropTarget.type === 'folder' && dropTarget.windowId) {
            // Folder-to-Folder: Store position for target folder (with normalized path)
            const folderContentElement = document.querySelector(
              `[data-folder-content="${dropTarget.windowId}"]`
            );
            if (folderContentElement) {
              const containerRect =
                folderContentElement.getBoundingClientRect();
              // Use the drag offset to position exactly where the mouse was
              const relativeX =
                upEvent.clientX - containerRect.left - dragOffset.x;
              const relativeY =
                upEvent.clientY - containerRect.top - dragOffset.y;

              // Normalize the target path before storing
              const normalizedTargetPath = normalizeFolderPath(dropTarget.path);

              const positionKey = `pendingFolderPosition_${
                file.id
              }_${normalizedTargetPath}_${Date.now()}`;
              sessionStorage.setItem(
                positionKey,
                JSON.stringify({
                  fileId: file.id,
                  fileName: file.name,
                  folderPath: normalizedTargetPath, // Store normalized path
                  x: Math.max(0, relativeX),
                  y: Math.max(0, relativeY),
                })
              );
            }
          }

          // Refresh desktop if moved to/from desktop
          if (
            dropTarget.path.includes('Desktop') ||
            currentPath.includes('Desktop')
          ) {
            if (dropTarget.type !== 'desktop') {
              // Moving from desktop to folder (not desktop), refresh desktop
              dispatch(refreshDesktopFromFileSystem());
            }
          }

          // Refresh all Explorer windows to reflect changes
          dispatch(refreshExplorerWindows());
        }
      } else if (dropTarget && dropTarget.path === currentPath) {
        // Same folder - just update position
        if (onMove && windowId) {
          // Use specific windowId to target the correct container element
          const containerElement = document.querySelector(
            `[data-folder-content="${windowId}"]`
          );

          if (containerElement) {
            const containerRect = containerElement.getBoundingClientRect();
            const newX = upEvent.clientX - containerRect.left - dragOffset.x;
            const newY = upEvent.clientY - containerRect.top - dragOffset.y;
            onMove(Math.max(0, newX), Math.max(0, newY));
          }
        }
      }
    },
    [file, currentPath, onMove, windowId, dispatch] // Add windowId to dependencies
  );

  return { handleFileDrop };
};
