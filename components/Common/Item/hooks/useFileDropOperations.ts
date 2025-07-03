import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DropTarget, UnifiedItemData } from '../types/dragDropTypes';
import {
  addPendingDesktopPosition,
  addPendingFolderPosition,
  clearPendingPositionsForFile,
} from '@/lib/slices/pendingPositionsSlice';
import { removeItemPosition } from '@/lib/slices/folderPositionsSlice';
import { moveItemToPath } from '@/lib/filesystem/operations';
import { refreshDesktopWithPendingPositions } from '@/lib/slices/desktopSlice';
import { refreshExplorerWindows, focusWindow } from '@/lib/slices/windowsSlice';
import { AppDispatch } from '@/lib/store';

interface UseFileDropOperationsProps {
  item: UnifiedItemData;
  context: 'desktop' | 'folder';
  currentPath?: string;
  windowId?: string;
  onMove?: (x: number, y: number) => void;
}

export const useFileDropOperations = ({
  item,
  context,
  currentPath,
  windowId,
  onMove,
}: UseFileDropOperationsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get current item path based on context
  const getCurrentItemPath = useCallback(
    (context: string, currentPath?: string) => {
      return context === 'desktop'
        ? 'C:\\Documents and Settings\\Administrator\\Desktop'
        : currentPath;
    },
    []
  );

  // Handle drops to different locations
  const handleCrossLocationDrop = useCallback(
    (dropTarget: DropTarget, mouseEvent?: MouseEvent) => {
      // Perform the actual filesystem move operation FIRST
      const moveSuccess = moveItemToPath(item.id, dropTarget.path);

      if (!moveSuccess) {
        return; // Exit early if the filesystem move failed
      }

      // Clear any existing position data for this item in the target location
      // This prevents old cached positions from overriding the new drop position
      if (dropTarget.type === 'folder') {
        // Clear any existing position data for this item in the target folder
        dispatch(
          removeItemPosition({
            folderPath: dropTarget.path,
            fileId: item.id,
            windowId: dropTarget.windowId,
          })
        );
      }

      // Clear any pending positions for this file to avoid conflicts
      dispatch(
        clearPendingPositionsForFile({
          fileId: item.id,
          fileName: item.name,
        })
      );

      // Calculate drop position based on mouse coordinates and target element
      let dropX = 100; // Default position
      let dropY = 100;

      if (mouseEvent) {
        let targetElement: Element | null = null;

        if (dropTarget.type === 'desktop') {
          targetElement = document.querySelector(
            '[data-drop-target="desktop"]'
          );
        } else if (dropTarget.type === 'folder') {
          // Try to find the specific folder content area
          if (dropTarget.windowId) {
            targetElement = document.querySelector(
              `[data-folder-content="${dropTarget.windowId}"]`
            );
          }
          // Fallback to any folder content area
          if (!targetElement) {
            targetElement = document.querySelector(
              '[data-drop-target="folder"]'
            );
          }
        }

        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();

          // Calculate position relative to the container
          const rawX = mouseEvent.clientX - rect.left - 40; // 40px offset for centering
          const rawY = mouseEvent.clientY - rect.top - 40;

          // Account for folder padding (8px) when dropping into folders
          if (dropTarget.type === 'folder') {
            // Subtract the folder's 8px padding to position relative to content area
            dropX = Math.max(0, rawX - 8);
            dropY = Math.max(0, rawY - 8);
          } else {
            // For desktop, no padding adjustment needed
            dropX = Math.max(0, rawX);
            dropY = Math.max(0, rawY);
          }
        }
      }

      // Create pending position for the target location (only after successful move)
      if (dropTarget.type === 'desktop') {
        const key = `desktop-${item.id}-${Date.now()}`;
        dispatch(
          addPendingDesktopPosition({
            key,
            position: {
              id: item.id,
              name: item.name,
              x: dropX,
              y: dropY,
            },
          })
        );
      } else if (dropTarget.type === 'folder') {
        const key = `folder-${item.id}-${Date.now()}`;
        dispatch(
          addPendingFolderPosition({
            key,
            position: {
              fileId: item.id,
              fileName: item.name,
              folderPath: dropTarget.path,
              x: dropX,
              y: dropY,
            },
          })
        );
      }

      // Refresh UI to reflect changes - dispatch async thunks correctly
      // Refresh desktop if source OR target is desktop
      if (dropTarget.type === 'desktop' || context === 'desktop') {
        // Refresh desktop to show newly moved item OR remove moved item from desktop
        dispatch(refreshDesktopWithPendingPositions());
      }

      // Always refresh explorer windows to update both source and target folders
      dispatch(refreshExplorerWindows());

      // Focus the target window if dropping into a folder
      if (dropTarget.type === 'folder' && dropTarget.windowId) {
        dispatch(focusWindow(dropTarget.windowId));
      }
    },
    [context, dispatch, item]
  );

  // Handle same-location repositioning
  const handleSameLocationDrop = useCallback(
    (dropTarget: DropTarget, mouseEvent: MouseEvent) => {
      if (!onMove) return;

      // Calculate the new position based on mouse coordinates
      let targetElement: Element | null = null;

      if (context === 'desktop') {
        // For desktop, use the desktop container
        targetElement = document.querySelector('[data-drop-target="desktop"]');
      } else if (context === 'folder') {
        // For folder, use the folder content area - try multiple selectors for robustness
        if (windowId) {
          targetElement = document.querySelector(
            `[data-folder-content="${windowId}"]`
          );
        }

        // Fallback: try to find any folder content area if windowId-specific search fails
        if (!targetElement) {
          targetElement = document.querySelector('[data-drop-target="folder"]');
        }
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();

        // Calculate position relative to the container
        const rawX = mouseEvent.clientX - rect.left - 40; // 40px offset for centering
        const rawY = mouseEvent.clientY - rect.top - 40;

        // Account for folder padding (8px) when repositioning within folders
        let newX: number;
        let newY: number;

        if (context === 'folder') {
          // Subtract the folder's 8px padding to position relative to content area
          newX = Math.max(0, rawX - 8);
          newY = Math.max(0, rawY - 8);
        } else {
          // For desktop, no padding adjustment needed
          newX = Math.max(0, rawX);
          newY = Math.max(0, rawY);
        }

        // Call the onMove callback to update the position
        onMove(newX, newY);
      }
    },
    [context, windowId, onMove]
  );

  // Refresh UI after successful drop
  const refreshUIAfterDrop = useCallback(() => {
    // Implementation for UI refresh
  }, []);

  // Main file drop handler
  const handleFileDrop = useCallback(
    (dropTarget: DropTarget | null, mouseEvent?: MouseEvent) => {
      if (!dropTarget) {
        return;
      }

      const itemPath = getCurrentItemPath(context, currentPath);

      if (dropTarget && dropTarget.path !== itemPath) {
        // Cross-location drop - pass mouseEvent for position calculation
        handleCrossLocationDrop(dropTarget, mouseEvent);
      } else if (dropTarget && dropTarget.path === itemPath && mouseEvent) {
        // Handle same location drop with repositioning
        handleSameLocationDrop(dropTarget, mouseEvent);
      }
    },
    [
      context,
      currentPath,
      getCurrentItemPath,
      handleCrossLocationDrop,
      handleSameLocationDrop,
    ]
  );

  return {
    handleFileDrop,
    refreshUIAfterDrop,
  };
};
