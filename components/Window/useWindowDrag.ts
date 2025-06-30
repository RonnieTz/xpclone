import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { moveWindow, focusWindow } from '@/lib/slices/windowsSlice';
import { setStartMenuOpen } from '@/lib/slices/startMenuSlice';
import { setStartButtonPressed } from '@/lib/slices/taskbarSlice';
import { WindowState } from '@/lib/slices/windowsSlice';

export const useWindowDrag = (window: WindowState) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Performance optimization: throttle mouse moves and batch updates
  const lastDispatchTime = useRef(0);
  const pendingPosition = useRef<{ x: number; y: number } | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const throttleDelay = 16; // ~60fps max, adjust for better performance under load

  const flushPendingPosition = useCallback(() => {
    if (pendingPosition.current && isDragging && !window.isMaximized) {
      dispatch(
        moveWindow({
          id: window.id,
          x: pendingPosition.current.x,
          y: pendingPosition.current.y,
        })
      );
      pendingPosition.current = null;
      lastDispatchTime.current = Date.now();
    }
    animationFrameId.current = null;
  }, [dispatch, window.id, window.isMaximized, isDragging]);

  const handleMouseDown = (
    e: React.MouseEvent,
    windowRef: React.RefObject<HTMLDivElement | null>
  ) => {
    e.preventDefault();
    dispatch(focusWindow(window.id));
    dispatch(setStartMenuOpen(false)); // Close start menu on drag
    dispatch(setStartButtonPressed(false)); // Reset start button pressed state

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

        const clampedY = Math.max(
          0, // Titlebar cannot go above desktop
          Math.min(newY, maxDesktopY - titleBarHeight) // Titlebar cannot go into taskbar area
        );

        // Performance optimization: throttle dispatches
        const now = Date.now();
        pendingPosition.current = { x: newX, y: clampedY };

        if (now - lastDispatchTime.current >= throttleDelay) {
          // Dispatch immediately if enough time has passed
          flushPendingPosition();
        } else if (!animationFrameId.current) {
          // Schedule a batched update for the next frame
          animationFrameId.current =
            requestAnimationFrame(flushPendingPosition);
        }
      }
    },
    [
      isDragging,
      dragOffset.x,
      dragOffset.y,
      window.isMaximized,
      throttleDelay,
      flushPendingPosition,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    // Flush any pending position update on mouse up
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (pendingPosition.current) {
      flushPendingPosition();
    }
  }, [flushPendingPosition]);

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    handleMouseDown,
  };
};
