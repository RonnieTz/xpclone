import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import {
  addPendingDesktopPosition,
  addPendingFolderPosition,
} from '@/lib/slices/pendingPositionsSlice';
import { focusWindow } from '@/lib/slices/windowsSlice';
import { DropTarget, UnifiedItemData } from '../types/dragDropTypes';

const FOLDER_CONTAINER_PADDING = 8;

interface UseDropPositioningProps {
  item: UnifiedItemData;
}

export const useDropPositioning = ({ item }: UseDropPositioningProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // Handle desktop drop positioning
  const handleDesktopDrop = useCallback(
    (upEvent: MouseEvent, dragOffset: { x: number; y: number }) => {
      const desktopRect = document
        .querySelector('[data-desktop]')
        ?.getBoundingClientRect();
      if (desktopRect) {
        const relativeX = upEvent.clientX - desktopRect.left - dragOffset.x;
        const relativeY = upEvent.clientY - desktopRect.top - dragOffset.y;

        const positionKey = `pendingDropPosition_${item.id}_${Date.now()}`;
        dispatch(
          addPendingDesktopPosition({
            key: positionKey,
            position: {
              name: item.name,
              id: item.id,
              x: Math.max(0, relativeX),
              y: Math.max(0, relativeY),
            },
          })
        );

        // Note: Desktop refresh will be handled elsewhere
        // dispatch(refreshDesktopWithPendingPositions()) would go here when needed
      }
    },
    [item, dispatch]
  );

  // Handle folder drop positioning
  const handleFolderDrop = useCallback(
    (
      dropTarget: DropTarget,
      upEvent: MouseEvent,
      dragOffset: { x: number; y: number }
    ) => {
      // Focus the target window when dropping into a folder
      if (dropTarget.windowId) {
        dispatch(focusWindow(dropTarget.windowId));
      }

      const folderContentElement = document.querySelector(
        `[data-folder-content="${dropTarget.windowId}"]`
      );

      if (folderContentElement) {
        const containerRect = folderContentElement.getBoundingClientRect();
        const relativeX =
          upEvent.clientX -
          containerRect.left -
          dragOffset.x -
          FOLDER_CONTAINER_PADDING;
        const relativeY =
          upEvent.clientY -
          containerRect.top -
          dragOffset.y -
          FOLDER_CONTAINER_PADDING;

        const normalizedPath = dropTarget.path
          .replace(/[\\\/]+$/, '')
          .replace(/\//g, '\\')
          .trim();
        const positionKey = `pendingFolderPosition_${
          item.id
        }_${normalizedPath}_${Date.now()}`;

        dispatch(
          addPendingFolderPosition({
            key: positionKey,
            position: {
              fileId: item.id,
              fileName: item.name,
              folderPath: normalizedPath,
              x: Math.max(0, relativeX),
              y: Math.max(0, relativeY),
            },
          })
        );
      }
    },
    [item, dispatch]
  );

  return {
    handleDesktopDrop,
    handleFolderDrop,
  };
};
