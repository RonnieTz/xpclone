import { useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { focusWindow } from '@/lib/slices/windowsSlice';
import { UseCustomDragDropProps, DragState } from '../types/dragDropTypes';
import { useDropTargetDetection } from './useDropTargetDetection';
import { useDragGhost } from './useDragGhost';
import { useFileDropOperations } from './useFileDropOperations';

export const useCustomDragDrop = ({
  file,
  viewMode,
  windowId,
  currentPath,
  onMove,
  onSelect,
}: UseCustomDragDropProps) => {
  const dispatch = useDispatch();
  const itemRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedElement: null,
    originalPosition: null,
    startMousePos: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
  });

  // Use the separated hooks
  const { findDropTarget } = useDropTargetDetection(windowId, currentPath);
  const { getViewportPosition, createDragGhost } = useDragGhost();
  const { handleFileDrop } = useFileDropOperations({
    file,
    currentPath,
    onMove,
    windowId, // Add windowId parameter
  });

  // Handle mouse down - start potential drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Focus the window first if it's not already focused
      if (windowId) {
        dispatch(focusWindow(windowId));
      }

      // Only allow dragging in icons view mode
      if (viewMode !== 'icons' || e.button !== 0) {
        // For non-icons view, handle selection here
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
          onSelect?.(e);
        }, 0);
        return;
      }

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

          if (itemRef.current) {
            // Get the exact current position of the original element
            const currentRect = getViewportPosition(itemRef.current);
            ghost = createDragGhost(itemRef.current);

            // Position ghost exactly where the original element is
            ghost.style.left = `${currentRect.x}px`;
            ghost.style.top = `${currentRect.y}px`;
            ghost.style.width = `${currentRect.width}px`;
            ghost.style.height = `${currentRect.height}px`;

            // Hide the original element during drag
            itemRef.current.style.opacity = '0';
            itemRef.current.style.pointerEvents = 'none'; // Exclude from elementsFromPoint

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

          // Only reset the temporary drag styles, not positioning
          if (itemRef.current) {
            itemRef.current.style.opacity = '';
            itemRef.current.style.pointerEvents = '';
            // Remove any temporary z-index that might have been applied during drag
            if (itemRef.current.style.zIndex === '999') {
              itemRef.current.style.zIndex = '';
            }
          }

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
    [
      viewMode,
      windowId,
      file,
      currentPath,
      onSelect,
      onMove,
      dispatch,
      getViewportPosition,
      findDropTarget,
      createDragGhost,
      handleFileDrop,
    ]
  );

  return {
    itemRef,
    handleMouseDown,
    isDragging: dragState.isDragging,
  };
};
