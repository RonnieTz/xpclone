import { useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unfocusAllWindows } from '@/lib/slices/windowsSlice';
import { moveItemToPath } from '@/lib/filesystem';
import { refreshExplorerWindows } from '@/lib/slices/windowsSlice';
import { refreshDesktopFromFileSystem } from '@/lib/slices/desktopSlice';
import { RootState } from '@/lib/store';

interface DragState {
  isDragging: boolean;
  draggedElement: HTMLElement | null;
  originalPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  startMousePos: { x: number; y: number };
  dragOffset: { x: number; y: number };
}

interface DropTarget {
  type: 'folder' | 'desktop' | 'same-folder';
  path: string;
  windowId?: string;
}

export const useDesktopDragDrop = (
  icon: any,
  onSelect: (event?: React.MouseEvent) => void,
  onMove: (x: number, y: number) => void
) => {
  const dispatch = useDispatch();
  const itemRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedElement: null,
    originalPosition: null,
    startMousePos: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
  });

  // Get all open windows to detect drop targets
  const windows = useSelector((state: RootState) => state.windows.windows);

  // Get viewport position of element
  const getViewportPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  // Create a ghost element for dragging
  const createDragGhost = (element: HTMLElement): HTMLElement => {
    const ghost = element.cloneNode(true) as HTMLElement;
    ghost.classList.add('dragging-ghost');
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '10000';
    ghost.style.opacity = '0.8';
    ghost.style.transform = 'none';
    document.body.appendChild(ghost);
    return ghost;
  };

  // Find what's under the cursor when dropping
  const findDropTarget = (x: number, y: number): DropTarget | null => {
    const elementsAtPoint = document.elementsFromPoint(x, y);
    const validElements = elementsAtPoint.filter(
      (el) => !el.classList.contains('dragging-ghost')
    );

    for (const element of validElements) {
      // Check if dropping on Explorer window's folder content area
      const folderContent = element.closest('[data-folder-content]');
      if (folderContent) {
        const targetWindowId = folderContent.getAttribute(
          'data-folder-content'
        );
        const targetPath = folderContent.getAttribute('data-folder-path');

        if (targetWindowId && targetPath) {
          return {
            type: 'folder',
            path: targetPath,
            windowId: targetWindowId,
          };
        }
      }

      // Check if dropping on a folder item within a folder window
      const fileItem = element.closest('[data-file-item]');
      if (fileItem) {
        const fileType = fileItem.getAttribute('data-file-type');
        if (fileType === 'folder') {
          const parentFolderContent = fileItem.closest('[data-folder-content]');
          if (parentFolderContent) {
            const parentPath =
              parentFolderContent.getAttribute('data-folder-path');
            const folderName = fileItem.textContent?.trim();
            if (folderName && parentPath) {
              const targetPath = `${parentPath}\\${folderName}`;
              return {
                type: 'folder',
                path: targetPath,
                windowId:
                  parentFolderContent.getAttribute('data-folder-content') ||
                  undefined,
              };
            }
          }
        }
      }

      // Check if dropping on an Explorer window
      const explorerWindow = element.closest('[data-window-id]');
      if (explorerWindow) {
        const targetWindowId = explorerWindow.getAttribute('data-window-id');
        if (targetWindowId) {
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

      // Check if dropping back on desktop
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
  };

  // Handle file drop operations
  const handleFileDrop = (
    dropTarget: DropTarget | null,
    upEvent: MouseEvent,
    dragOffset: { x: number; y: number }
  ) => {
    const currentDesktopPath =
      'C:\\Documents and Settings\\Administrator\\Desktop';

    if (
      dropTarget &&
      dropTarget.path !== currentDesktopPath &&
      icon.fileSystemItem
    ) {
      // Move file to different location (desktop to folder)
      const success = moveItemToPath(icon.fileSystemItem.id, dropTarget.path);

      if (success) {
        // If dropped into a folder, store the exact position for the folder view
        if (dropTarget.type === 'folder' && dropTarget.windowId) {
          const folderContentElement = document.querySelector(
            `[data-folder-content="${dropTarget.windowId}"]`
          );
          if (folderContentElement) {
            const containerRect = folderContentElement.getBoundingClientRect();
            const relativeX = upEvent.clientX - containerRect.left - 40; // Center on cursor
            const relativeY = upEvent.clientY - containerRect.top - 40; // Center on cursor

            // Store position for the folder using the same system as folder items
            const positionKey = `pendingFolderPosition_${
              icon.fileSystemItem.id
            }_${dropTarget.path}_${Date.now()}`;
            sessionStorage.setItem(
              positionKey,
              JSON.stringify({
                fileId: icon.fileSystemItem.id,
                fileName: icon.name,
                folderPath: dropTarget.path,
                x: Math.max(0, relativeX),
                y: Math.max(0, relativeY),
              })
            );
          }
        }

        // Refresh desktop to remove the moved icon
        dispatch(refreshDesktopFromFileSystem());
        // Refresh all Explorer windows to show the moved file
        dispatch(refreshExplorerWindows());
      }
    } else if (dropTarget && dropTarget.path === currentDesktopPath) {
      // Same desktop - use the exact same calculation as folder items for consistency
      const desktopRect = document
        .querySelector('[data-desktop]')
        ?.getBoundingClientRect();
      if (desktopRect) {
        // Use the same positioning calculation as folder items - center the icon on cursor
        const relativeX = upEvent.clientX - desktopRect.left - 40; // 40 is half icon width
        const relativeY = upEvent.clientY - desktopRect.top - 40; // 40 is half icon height
        onMove(Math.max(0, relativeX), Math.max(0, relativeY));
      }
    }
  };

  // Handle mouse down - start potential drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only handle left mouse button

      e.preventDefault();
      e.stopPropagation();

      // Handle selection first
      setTimeout(() => {
        onSelect?.(e);
      }, 0);

      if (!itemRef.current) return;

      const element = itemRef.current;
      const viewportPos = getViewportPosition(element);
      const startMousePos = { x: e.clientX, y: e.clientY };
      const dragOffset = {
        x: e.clientX - viewportPos.x,
        y: e.clientY - viewportPos.y,
      };

      setDragState({
        isDragging: false,
        draggedElement: null,
        originalPosition: viewportPos,
        startMousePos,
        dragOffset,
      });

      const threshold = 5;
      let hasMoved = false;
      let ghost: HTMLElement | null = null;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = Math.abs(moveEvent.clientX - startMousePos.x);
        const deltaY = Math.abs(moveEvent.clientY - startMousePos.y);

        if (!hasMoved && (deltaX > threshold || deltaY > threshold)) {
          // Start drag operation
          hasMoved = true;
          dispatch(unfocusAllWindows());

          if (itemRef.current) {
            const currentRect = getViewportPosition(itemRef.current);
            ghost = createDragGhost(itemRef.current);

            // Position ghost exactly where the original element is
            ghost.style.left = `${currentRect.x}px`;
            ghost.style.top = `${currentRect.y}px`;
            ghost.style.width = `${currentRect.width}px`;
            ghost.style.height = `${currentRect.height}px`;

            // Hide the original element during drag
            itemRef.current.style.opacity = '0';
            itemRef.current.style.pointerEvents = 'none';

            setDragState((prev) => ({
              ...prev,
              isDragging: true,
              draggedElement: ghost,
            }));
          }
        }

        if (hasMoved && ghost) {
          // Update the ghost element position using the drag offset
          const newX = moveEvent.clientX - dragOffset.x;
          const newY = moveEvent.clientY - dragOffset.y;

          ghost.style.left = `${newX}px`;
          ghost.style.top = `${newY}px`;
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        if (hasMoved && itemRef.current) {
          // Find drop target and handle file drop
          const dropTarget = findDropTarget(upEvent.clientX, upEvent.clientY);
          handleFileDrop(dropTarget, upEvent, dragOffset);

          // Reset the temporary drag styles
          itemRef.current.style.opacity = '';
          itemRef.current.style.pointerEvents = '';

          // Remove ghost element
          if (ghost) {
            document.body.removeChild(ghost);
          }
        }

        setDragState({
          isDragging: false,
          draggedElement: null,
          originalPosition: null,
          startMousePos: { x: 0, y: 0 },
          dragOffset: { x: 0, y: 0 },
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [icon, onSelect, onMove, dispatch, windows]
  );

  return {
    itemRef,
    handleMouseDown,
    isDragging: dragState.isDragging,
  };
};
