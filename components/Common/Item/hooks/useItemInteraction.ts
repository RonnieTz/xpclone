import { useRef } from 'react';
import { UnifiedItemData } from '../types';

export const useItemInteraction = (
  item: UnifiedItemData,
  onSelect?: (event?: React.MouseEvent) => void,
  onMove?: (x: number, y: number) => void
) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button

    e.preventDefault();
    e.stopPropagation();

    onSelect?.(e);

    // Handle drag functionality if onMove is provided
    if (onMove) {
      let isDragging = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const threshold = 5;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = Math.abs(moveEvent.clientX - startX);
        const deltaY = Math.abs(moveEvent.clientY - startY);

        if (!isDragging && (deltaX > threshold || deltaY > threshold)) {
          isDragging = true;
        }

        if (isDragging) {
          const rect = itemRef.current?.offsetParent?.getBoundingClientRect();
          if (rect) {
            const newX = Math.max(0, moveEvent.clientX - rect.left - 40);
            const newY = Math.max(0, moveEvent.clientY - rect.top - 40);
            onMove(newX, newY);
          }
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return {
    itemRef,
    handleMouseDown,
  };
};
