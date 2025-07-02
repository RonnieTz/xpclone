import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { focusWindow } from '@/lib/slices/windowsSlice';

interface UseDragHandlingProps {
  viewMode: string;
  windowId?: string;
  onMove?: (x: number, y: number) => void;
  onSelect?: (e: React.MouseEvent) => void;
}

export const useDragHandling = ({
  viewMode,
  windowId,
  onMove,
  onSelect,
}: UseDragHandlingProps) => {
  const dispatch = useDispatch();
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Focus the window first if it's not already focused
    if (windowId) {
      dispatch(focusWindow(windowId));
    }

    // Only allow dragging in icons view mode
    if (viewMode !== 'icons' || !onMove || e.button !== 0) {
      // For non-icons view or when dragging is disabled, handle selection here
      e.preventDefault();
      e.stopPropagation();

      // Add a small delay to ensure window focus completes before selection
      setTimeout(() => {
        onSelect?.(e);
      }, 0);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Add a small delay to ensure window focus completes before selection
    setTimeout(() => {
      onSelect?.(e);
    }, 0);

    let isDragging = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const threshold = 5; // Minimum pixels to move before starting drag

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);

      if (!isDragging && (deltaX > threshold || deltaY > threshold)) {
        // Start drag operation - window is already focused
        isDragging = true;
      }

      if (isDragging) {
        // Update item position during drag with boundary constraints
        const containerRect =
          itemRef.current?.offsetParent?.getBoundingClientRect();
        if (containerRect) {
          const itemWidth = 80; // Fixed width of file items
          const itemHeight = 80; // Approximate height of file items

          // Calculate new position relative to container
          let newX = moveEvent.clientX - containerRect.left - 40;
          let newY = moveEvent.clientY - containerRect.top - 40;

          // Apply boundary constraints
          newX = Math.max(0, Math.min(newX, containerRect.width - itemWidth));
          newY = Math.max(0, Math.min(newY, containerRect.height - itemHeight));

          onMove(newX, newY);
        }
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { itemRef, handleMouseDown };
};
