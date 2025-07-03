import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { focusWindow } from '@/lib/slices/windowsSlice';

const FOLDER_CONTAINER_PADDING = 8;

interface UseRepositioningProps {
  context: 'desktop' | 'folder';
  windowId?: string;
  onMove?: (x: number, y: number) => void;
}

export const useRepositioning = ({
  context,
  windowId,
  onMove,
}: UseRepositioningProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // Handle desktop repositioning
  const handleDesktopRepositioning = useCallback(
    (upEvent: MouseEvent, dragOffset: { x: number; y: number }) => {
      const desktopRect = document
        .querySelector('[data-desktop]')
        ?.getBoundingClientRect();
      if (desktopRect && onMove) {
        const newX = upEvent.clientX - desktopRect.left - dragOffset.x;
        const newY = upEvent.clientY - desktopRect.top - dragOffset.y;
        onMove(Math.max(0, newX), Math.max(0, newY));
      }
    },
    [onMove]
  );

  // Handle folder repositioning
  const handleFolderRepositioning = useCallback(
    (upEvent: MouseEvent, dragOffset: { x: number; y: number }) => {
      if (windowId) {
        dispatch(focusWindow(windowId));

        const containerElement = document.querySelector(
          `[data-folder-content="${windowId}"]`
        );
        if (containerElement && onMove) {
          const containerRect = containerElement.getBoundingClientRect();
          const newX =
            upEvent.clientX -
            containerRect.left -
            dragOffset.x -
            FOLDER_CONTAINER_PADDING;
          const newY =
            upEvent.clientY -
            containerRect.top -
            dragOffset.y -
            FOLDER_CONTAINER_PADDING;
          onMove(Math.max(0, newX), Math.max(0, newY));
        }
      }
    },
    [windowId, onMove, dispatch]
  );

  // Handle same location drop (repositioning)
  const handleSameLocationDrop = useCallback(
    (upEvent: MouseEvent, dragOffset: { x: number; y: number }) => {
      if (onMove) {
        if (context === 'desktop') {
          handleDesktopRepositioning(upEvent, dragOffset);
        } else if (windowId) {
          handleFolderRepositioning(upEvent, dragOffset);
        }
      }
    },
    [
      context,
      windowId,
      onMove,
      handleDesktopRepositioning,
      handleFolderRepositioning,
    ]
  );

  return {
    handleSameLocationDrop,
    handleDesktopRepositioning,
    handleFolderRepositioning,
  };
};
