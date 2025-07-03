import { useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { focusWindow, unfocusAllWindows } from '@/lib/slices/windowsSlice';
import { DragState, UseUnifiedDragDropProps } from '../types/dragDropTypes';
import { useGhostElement } from './useGhostElement';
import { useDropTargetDetection } from './useDropTargetDetection';
import { useFileDropOperations } from './useFileDropOperations';

export const useUnifiedDragDrop = ({
  item,
  context,
  viewMode = 'icons',
  currentPath,
  windowId,
  onSelect,
  onMove,
}: UseUnifiedDragDropProps) => {
  const dispatch = useDispatch();
  const itemRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    ghostElement: null,
    originalPosition: null,
    startMousePos: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
  });

  // Use the separated hooks
  const {
    getViewportPosition,
    createGhostElement,
    updateGhostPosition,
    removeGhostElement,
  } = useGhostElement();

  // For desktop context, use desktop path; for folder context, use current path
  const effectiveCurrentPath =
    context === 'desktop'
      ? 'C:\\Documents and Settings\\Administrator\\Desktop'
      : currentPath;

  const { detectDropTarget } = useDropTargetDetection(
    windowId,
    effectiveCurrentPath
  );
  const { handleFileDrop } = useFileDropOperations({
    item,
    context,
    currentPath: effectiveCurrentPath,
    windowId,
    onMove,
  });

  // Check if item should be draggable
  const isDraggable = useCallback(() => {
    if (context === 'desktop') return true;
    if (context === 'folder' && viewMode === 'icons') return true;
    return false;
  }, [context, viewMode]);

  // Main mouse down handler
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only handle left mouse button

      e.preventDefault();
      e.stopPropagation();

      // Handle selection first
      setTimeout(() => {
        onSelect?.(e as React.MouseEvent<HTMLElement>);
      }, 0);

      // For desktop context, unfocus all windows when starting drag
      if (context === 'desktop') {
        dispatch(unfocusAllWindows());
      } else if (windowId) {
        // Focus window if in folder context
        dispatch(focusWindow(windowId));
      }

      // Return early if not draggable
      if (!isDraggable()) return;

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
        ghostElement: null,
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

          if (itemRef.current) {
            const currentRect = getViewportPosition(itemRef.current);
            ghost = createGhostElement(itemRef.current);

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
              ghostElement: ghost,
            }));
          }
        }

        if (hasMoved && ghost) {
          // Update ghost position
          const newX = moveEvent.clientX - dragOffset.x;
          const newY = moveEvent.clientY - dragOffset.y;
          updateGhostPosition(ghost, newX, newY);
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        if (hasMoved && itemRef.current) {
          // Find drop target and handle file drop
          const dropTarget = detectDropTarget(upEvent);
          handleFileDrop(dropTarget, upEvent); // Pass the mouse event for position calculation

          // Restore original element
          itemRef.current.style.opacity = '';
          itemRef.current.style.pointerEvents = '';

          // Remove ghost element
          if (ghost) {
            removeGhostElement(ghost);
          }
        }

        setDragState({
          isDragging: false,
          ghostElement: null,
          originalPosition: null,
          startMousePos: { x: 0, y: 0 },
          dragOffset: { x: 0, y: 0 },
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [
      windowId,
      onSelect,
      isDraggable,
      context,
      getViewportPosition,
      createGhostElement,
      updateGhostPosition,
      removeGhostElement,
      detectDropTarget,
      handleFileDrop,
      dispatch,
    ]
  );

  return {
    itemRef,
    handleMouseDown,
    isDragging: dragState.isDragging,
  };
};
