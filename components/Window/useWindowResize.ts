import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { resizeWindow, moveWindow } from '@/lib/slices/windowsSlice';
import { WindowState } from '@/lib/slices/windowsSlice';

type ResizeDirection = 'se' | 'sw' | 'ne' | 'nw' | 'n' | 's' | 'e' | 'w';

export const useWindowResize = (window: WindowState) => {
  const dispatch = useDispatch();
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>('se');
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    windowX: 0,
    windowY: 0,
  });

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    direction: ResizeDirection
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.isResizable && !window.isMaximized) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: window.width,
        height: window.height,
        windowX: window.x,
        windowY: window.y,
      });
      setResizeDirection(direction);
      setIsResizing(true);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing && window.isResizable && !window.isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.windowX;
        let newY = resizeStart.windowY;

        switch (resizeDirection) {
          case 'se': // Southeast (bottom-right)
            newWidth = Math.max(200, resizeStart.width + deltaX);
            newHeight = Math.max(100, resizeStart.height + deltaY);
            break;
          case 'sw': // Southwest (bottom-left)
            newWidth = Math.max(200, resizeStart.width - deltaX);
            newHeight = Math.max(100, resizeStart.height + deltaY);
            newX = resizeStart.windowX + (resizeStart.width - newWidth);
            break;
          case 'ne': // Northeast (top-right)
            newWidth = Math.max(200, resizeStart.width + deltaX);
            newHeight = Math.max(100, resizeStart.height - deltaY);
            newY = resizeStart.windowY + (resizeStart.height - newHeight);
            break;
          case 'nw': // Northwest (top-left)
            newWidth = Math.max(200, resizeStart.width - deltaX);
            newHeight = Math.max(100, resizeStart.height - deltaY);
            newX = resizeStart.windowX + (resizeStart.width - newWidth);
            newY = resizeStart.windowY + (resizeStart.height - newHeight);
            break;
          case 'n': // North (top)
            newHeight = Math.max(100, resizeStart.height - deltaY);
            newY = resizeStart.windowY + (resizeStart.height - newHeight);
            break;
          case 's': // South (bottom)
            newHeight = Math.max(100, resizeStart.height + deltaY);
            break;
          case 'e': // East (right)
            newWidth = Math.max(200, resizeStart.width + deltaX);
            break;
          case 'w': // West (left)
            newWidth = Math.max(200, resizeStart.width - deltaX);
            newX = resizeStart.windowX + (resizeStart.width - newWidth);
            break;
        }

        dispatch(
          resizeWindow({
            id: window.id,
            width: newWidth,
            height: newHeight,
          })
        );

        // Move window if resizing from left or top edges
        if (
          resizeDirection === 'sw' ||
          resizeDirection === 'ne' ||
          resizeDirection === 'nw' ||
          resizeDirection === 'n' ||
          resizeDirection === 'w'
        ) {
          dispatch(
            moveWindow({
              id: window.id,
              x: newX,
              y: newY,
            })
          );
        }
      }
    },
    [
      isResizing,
      window.isResizable,
      window.isMaximized,
      window.id,
      resizeStart,
      resizeDirection,
      dispatch,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    isResizing,
    handleResizeMouseDown,
  };
};
