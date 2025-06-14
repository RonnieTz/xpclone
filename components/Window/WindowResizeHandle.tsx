import React from 'react';
import { WindowState } from '@/lib/slices/windowsSlice';

type ResizeDirection = 'se' | 'sw' | 'ne' | 'nw' | 'n' | 's' | 'e' | 'w';

interface WindowResizeHandleProps {
  window: WindowState;
  onMouseDown: (e: React.MouseEvent, direction: ResizeDirection) => void;
}

const WindowResizeHandle: React.FC<WindowResizeHandleProps> = ({
  window,
  onMouseDown,
}) => {
  if (!window.isResizable || window.isMaximized) {
    return null;
  }

  const getCursorClass = (direction: ResizeDirection) => {
    switch (direction) {
      case 'se':
        return 'cursor-nw-resize';
      case 'sw':
        return 'cursor-ne-resize';
      case 'ne':
        return 'cursor-sw-resize';
      case 'nw':
        return 'cursor-se-resize';
      case 'n':
      case 's':
        return 'cursor-ns-resize';
      case 'e':
      case 'w':
        return 'cursor-ew-resize';
    }
  };

  return (
    <>
      {/* Corner handles */}
      {/* Bottom-right corner */}
      <div
        className={`absolute -bottom-2 -right-2 w-4 h-4 ${getCursorClass(
          'se'
        )}`}
        onMouseDown={(e) => onMouseDown(e, 'se')}
      />

      {/* Bottom-left corner */}
      <div
        className={`absolute -bottom-2 -left-2 w-4 h-4 ${getCursorClass('sw')}`}
        onMouseDown={(e) => onMouseDown(e, 'sw')}
      />

      {/* Top-right corner */}
      <div
        className={`absolute -top-2 -right-2 w-4 h-4 ${getCursorClass('ne')}`}
        onMouseDown={(e) => onMouseDown(e, 'ne')}
      />

      {/* Top-left corner */}
      <div
        className={`absolute -top-2 -left-2 w-4 h-4 ${getCursorClass('nw')}`}
        onMouseDown={(e) => onMouseDown(e, 'nw')}
      />

      {/* Side handles - 80% width/height, centered, thicker for easier grabbing */}
      {/* Top side */}
      <div
        className={`absolute -top-2 left-1/2 transform -translate-x-1/2 h-4 ${getCursorClass(
          'n'
        )}`}
        style={{ width: '80%' }}
        onMouseDown={(e) => onMouseDown(e, 'n')}
      />

      {/* Bottom side */}
      <div
        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-4 ${getCursorClass(
          's'
        )}`}
        style={{ width: '80%' }}
        onMouseDown={(e) => onMouseDown(e, 's')}
      />

      {/* Left side */}
      <div
        className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 ${getCursorClass(
          'w'
        )}`}
        style={{ height: '80%' }}
        onMouseDown={(e) => onMouseDown(e, 'w')}
      />

      {/* Right side */}
      <div
        className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 ${getCursorClass(
          'e'
        )}`}
        style={{ height: '80%' }}
        onMouseDown={(e) => onMouseDown(e, 'e')}
      />
    </>
  );
};

export default WindowResizeHandle;
