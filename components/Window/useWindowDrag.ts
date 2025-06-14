import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { moveWindow, focusWindow } from '@/lib/slices/windowsSlice';
import { WindowState } from '@/lib/slices/windowsSlice';

export const useWindowDrag = (window: WindowState) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (
    e: React.MouseEvent,
    windowRef: React.RefObject<HTMLDivElement | null>
  ) => {
    e.preventDefault();
    dispatch(focusWindow(window.id));

    if (!window.isMaximized) {
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsDragging(true);
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Allow window to go outside on sides and bottom, but prevent overlap with taskbar
        const titleBarHeight = 32; // 8 * 4px (h-8 in Tailwind)
        const taskbarHeight = 40;
        const maxDesktopY = globalThis.innerHeight - taskbarHeight;

        dispatch(
          moveWindow({
            id: window.id,
            x: newX, // No horizontal constraints - can go outside on sides
            y: Math.max(
              0, // Titlebar cannot go above desktop
              Math.min(newY, maxDesktopY - titleBarHeight) // Titlebar cannot go into taskbar area
            ),
          })
        );
      }
    },
    [
      isDragging,
      dragOffset.x,
      dragOffset.y,
      window.isMaximized,
      window.id,
      dispatch,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    handleMouseDown,
  };
};
