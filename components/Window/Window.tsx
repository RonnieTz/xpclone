'use client';

import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WindowState } from '@/lib/slices/windowsSlice';
import {
  focusWindow,
  setWindowAnimating,
  setMinimizeAnimating,
  setRestoreAnimating,
} from '@/lib/slices/windowsSlice';
import { useWindowDrag } from './useWindowDrag';
import { useWindowResize } from './useWindowResize';
import { useModalWindow } from './useModalWindow';
import WindowTitleBar from './WindowTitleBar';
import WindowContent from './WindowContent';
import WindowResizeHandle from './WindowResizeHandle';
import WindowBorders from './WindowBorders';
import ModalOverlay from './ModalOverlay';

interface WindowProps {
  window: WindowState;
}

const Window: React.FC<WindowProps> = ({ window }) => {
  const dispatch = useDispatch();
  const windowRef = useRef<HTMLDivElement>(null);

  const { isDragging, handleMouseDown: handleDragMouseDown } =
    useWindowDrag(window);
  const { isResizing, handleResizeMouseDown } = useWindowResize(window);
  const { isDisabled, isModal, canReceiveFocus } = useModalWindow(window);

  // Handle animation state reset
  useEffect(() => {
    if (window.isAnimating) {
      const timer = setTimeout(() => {
        dispatch(setWindowAnimating({ id: window.id, isAnimating: false }));
      }, 300); // Match the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [window.isAnimating, window.id, dispatch]);

  // Handle minimize animation
  useEffect(() => {
    if (window.isMinimizeAnimating) {
      const timer = setTimeout(() => {
        dispatch(setMinimizeAnimating({ id: window.id, isAnimating: false }));
      }, 300); // Match the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [window.isMinimizeAnimating, window.id, dispatch]);

  // Handle restore animation with proper staging
  useEffect(() => {
    if (window.isRestoreAnimating) {
      // First, render the window at taskbar position
      // Then after a small delay, trigger the animation to normal position
      const timer = setTimeout(() => {
        dispatch(setRestoreAnimating({ id: window.id, isAnimating: false }));
      }, 300); // Match the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [window.isRestoreAnimating, window.id, dispatch]);

  // Add effect to handle the restore animation start
  useEffect(() => {
    if (
      window.isRestoreAnimating &&
      window.taskbarAnimationTarget &&
      windowRef.current
    ) {
      // Initially set the window at taskbar position
      const element = windowRef.current;
      element.style.transition = 'none';
      element.style.top = `${window.taskbarAnimationTarget.y}px`;
      element.style.left = `${window.taskbarAnimationTarget.x}px`;
      element.style.width = `${window.taskbarAnimationTarget.width}px`;
      element.style.height = `${window.taskbarAnimationTarget.height}px`;
      element.style.opacity = '0.3';

      // Force a repaint
      void element.offsetHeight;

      // Then animate to target position
      requestAnimationFrame(() => {
        element.style.transition = 'all 300ms ease-in-out';

        // If maximized, animate to fullscreen
        if (window.isMaximized) {
          element.style.top = '0px';
          element.style.left = '0px';
          element.style.width = '100vw';
          element.style.height = 'calc(100vh - 40px)';
        } else {
          // Otherwise animate to windowed position
          element.style.top = `${window.y}px`;
          element.style.left = `${window.x}px`;
          element.style.width = `${window.width}px`;
          element.style.height = `${window.height}px`;
        }
        element.style.opacity = '1';
      });

      const timer = setTimeout(() => {
        dispatch(setRestoreAnimating({ id: window.id, isAnimating: false }));
        // Reset styles to let normal style management take over
        if (element) {
          element.style.removeProperty('transition');
          element.style.removeProperty('top');
          element.style.removeProperty('left');
          element.style.removeProperty('width');
          element.style.removeProperty('height');
          element.style.removeProperty('opacity');
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [
    window.isRestoreAnimating,
    window.taskbarAnimationTarget,
    window.id,
    window.x,
    window.y,
    window.width,
    window.height,
    window.isMaximized,
    dispatch,
  ]);

  // Add effect to clean up any lingering inline styles when dragging starts
  useEffect(() => {
    if (isDragging && windowRef.current) {
      const element = windowRef.current;
      // Only remove the transition property that could interfere with dragging
      // Keep position and size styles as they might be needed for dragging
      element.style.removeProperty('transition');
    }
  }, [isDragging]);

  // Add effect to clean up any lingering inline styles when resizing starts
  useEffect(() => {
    if (isResizing && windowRef.current) {
      const element = windowRef.current;
      // Remove transition property that could interfere with resizing
      element.style.removeProperty('transition');
    }
  }, [isResizing]);

  const handleWindowClick = () => {
    // Only allow focus if window can receive focus (not disabled by modal)
    if (canReceiveFocus) {
      dispatch(focusWindow(window.id));
    }
  };

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging if window is not disabled
    if (canReceiveFocus && !isDisabled) {
      handleDragMouseDown(e, windowRef);
    }
  };

  const handleModalOverlayClick = () => {
    // Optional: Flash the modal window or play a sound to indicate it needs attention
    // For now, just ensure the modal stays focused
    if (window.isModal) {
      dispatch(focusWindow(window.id));
    }
  };

  // Don't render window if minimized and not animating
  if (
    window.isMinimized &&
    !window.isMinimizeAnimating &&
    !window.isRestoreAnimating
  ) {
    return null;
  }

  // Calculate window style based on animation state
  const getWindowStyle = () => {
    // Handle minimize animation - animate to taskbar position (prioritize over maximized state)
    if (window.isMinimizeAnimating && window.taskbarAnimationTarget) {
      return {
        top: window.taskbarAnimationTarget.y,
        left: window.taskbarAnimationTarget.x,
        width: window.taskbarAnimationTarget.width,
        height: window.taskbarAnimationTarget.height,
        opacity: 0.3,
      };
    }

    // Handle restore animation - start from taskbar, then animate to normal position
    if (window.isRestoreAnimating && window.taskbarAnimationTarget) {
      // If the window is maximized, animate directly to maximized size
      if (window.isMaximized) {
        return {
          top: 0,
          left: 0,
          width: '100vw',
          height: 'calc(100vh - 40px)',
          opacity: 1,
        };
      }

      return {
        top: window.y,
        left: window.x,
        width: window.width,
        height: window.height,
        opacity: 1,
      };
    }

    if (window.isMaximized) {
      return { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 40px)' };
    }

    // Normal window position
    return {
      top: window.y,
      left: window.x,
      width: window.width,
      height: window.height,
    };
  };

  const windowStyle = getWindowStyle();

  // Determine if we should show transition
  const shouldAnimate =
    !isDragging &&
    !isResizing &&
    (window.isAnimating ||
      window.isMinimizeAnimating ||
      window.isRestoreAnimating);

  return (
    <>
      {/* Render modal overlay if this is a modal window */}
      {isModal && window.modalOverlayId && (
        <ModalOverlay
          id={window.modalOverlayId}
          parentWindowId={window.parentWindowId!}
          zIndex={window.zIndex}
          onOverlayClick={handleModalOverlayClick}
        />
      )}

      <div
        ref={windowRef}
        data-window
        data-window-id={window.id}
        data-modal={isModal}
        data-disabled={isDisabled}
        className={`absolute bg-gray-100 shadow-lg overflow-hidden ${
          window.isMaximized ? '' : 'rounded-t-lg'
        } ${isDragging ? 'cursor-grabbing' : ''} ${
          shouldAnimate ? 'transition-all duration-300 ease-in-out' : ''
        } ${isDisabled ? 'pointer-events-none opacity-75' : ''}`}
        style={{
          ...windowStyle,
          zIndex: window.zIndex,
        }}
        onClick={handleWindowClick}
      >
        <WindowTitleBar
          window={window}
          onMouseDown={handleTitleBarMouseDown}
          isDragging={isDragging}
          isDisabled={isDisabled}
        />
        <WindowContent window={window} />
        {!isDisabled && (
          <WindowResizeHandle
            window={window}
            onMouseDown={handleResizeMouseDown}
          />
        )}
        <WindowBorders window={window} />
      </div>
    </>
  );
};

export default Window;
