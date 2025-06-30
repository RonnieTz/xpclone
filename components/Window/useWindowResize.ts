import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { resizeWindow, moveWindow } from '@/lib/slices/windowsSlice';
import { WindowState } from '@/lib/slices/windowsSlice';

type ResizeDirection = 'se' | 'sw' | 'ne' | 'nw' | 'n' | 's' | 'e' | 'w';

// Window size constraints
const MIN_WINDOW_WIDTH = 550;
const MIN_WINDOW_HEIGHT = 150;

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

  // Performance optimization: throttle resize operations
  const lastDispatchTime = useRef(0);
  const pendingResize = useRef<{
    width: number;
    height: number;
    x?: number;
    y?: number;
  } | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const throttleDelay = 46; // ~60fps max, adjust for better performance under load

  const flushPendingResize = useCallback(() => {
    if (
      pendingResize.current &&
      isResizing &&
      window.isResizable &&
      !window.isMaximized
    ) {
      const { width, height, x, y } = pendingResize.current;

      dispatch(
        resizeWindow({
          id: window.id,
          width,
          height,
        })
      );

      // Move window if resizing from left or top edges
      if (x !== undefined && y !== undefined) {
        dispatch(
          moveWindow({
            id: window.id,
            x,
            y,
          })
        );
      }

      pendingResize.current = null;
      lastDispatchTime.current = Date.now();
    }
    animationFrameId.current = null;
  }, [dispatch, window.id, window.isResizable, window.isMaximized, isResizing]);

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
            newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStart.width + deltaX);
            newHeight = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeStart.height + deltaY
            );
            break;
          case 'sw': // Southwest (bottom-left)
            newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStart.width - deltaX);
            newHeight = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeStart.height + deltaY
            );
            newX = resizeStart.windowX + (resizeStart.width - newWidth);
            break;
          case 'ne': // Northeast (top-right)
            newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStart.width + deltaX);
            newHeight = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeStart.height - deltaY
            );
            newY = resizeStart.windowY + (resizeStart.height - newHeight);
            break;
          case 'nw': // Northwest (top-left)
            newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStart.width - deltaX);
            newHeight = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeStart.height - deltaY
            );
            newX = resizeStart.windowX + (resizeStart.width - newWidth);
            newY = resizeStart.windowY + (resizeStart.height - newHeight);
            break;
          case 'n': // North (top)
            newHeight = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeStart.height - deltaY
            );
            newY = resizeStart.windowY + (resizeStart.height - newHeight);
            break;
          case 's': // South (bottom)
            newHeight = Math.max(
              MIN_WINDOW_HEIGHT,
              resizeStart.height + deltaY
            );
            break;
          case 'e': // East (right)
            newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStart.width + deltaX);
            break;
          case 'w': // West (left)
            newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStart.width - deltaX);
            newX = resizeStart.windowX + (resizeStart.width - newWidth);
            break;
        }

        // Performance optimization: throttle dispatches
        const now = Date.now();
        const needsMove =
          resizeDirection === 'sw' ||
          resizeDirection === 'ne' ||
          resizeDirection === 'nw' ||
          resizeDirection === 'n' ||
          resizeDirection === 'w';

        pendingResize.current = {
          width: newWidth,
          height: newHeight,
          ...(needsMove && { x: newX, y: newY }),
        };

        if (now - lastDispatchTime.current >= throttleDelay) {
          // Dispatch immediately if enough time has passed
          flushPendingResize();
        } else if (!animationFrameId.current) {
          // Schedule a batched update for the next frame
          animationFrameId.current = requestAnimationFrame(flushPendingResize);
        }
      }
    },
    [
      isResizing,
      window.isResizable,
      window.isMaximized,
      resizeStart,
      resizeDirection,
      throttleDelay,
      flushPendingResize,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);

    // Flush any pending resize update on mouse up
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (pendingResize.current) {
      flushPendingResize();
    }
  }, [flushPendingResize]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Clean up any pending animation frame
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    isResizing,
    handleResizeMouseDown,
  };
};
