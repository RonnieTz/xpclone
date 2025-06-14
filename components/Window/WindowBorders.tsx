import React from 'react';
import { WindowState } from '@/lib/slices/windowsSlice';

interface WindowBordersProps {
  window: WindowState;
}

const WindowBorders: React.FC<WindowBordersProps> = ({ window }) => {
  // Don't show borders when maximized
  if (window.isMaximized) {
    return null;
  }

  return (
    <>
      {/* Left border - positioned below title bar */}
      <div
        className={`absolute left-0 bg-repeat-y ${
          window.isActive ? '' : 'opacity-75'
        }`}
        style={{
          top: '32px', // Below title bar (8px) + menu bar (24px)
          bottom: '2px', // Above bottom border
          width: '2px',
          backgroundImage: 'url(/leftborder.png)',
          backgroundSize: '100% auto',
        }}
      />

      {/* Right border - positioned below title bar */}
      <div
        className={`absolute right-0 bg-repeat-y ${
          window.isActive ? '' : 'opacity-75'
        }`}
        style={{
          top: '32px', // Below title bar (8px) + menu bar (24px)
          bottom: '2px', // Above bottom border
          width: '2px',
          backgroundImage: 'url(/rightborder.png)',
          backgroundSize: '100% auto',
        }}
      />

      {/* Bottom border */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-repeat-x ${
          window.isActive ? '' : 'opacity-75'
        }`}
        style={{
          height: '2px',
          backgroundImage: 'url(/bottomborder.png)',
          backgroundSize: 'auto 100%',
        }}
      />
    </>
  );
};

export default WindowBorders;
