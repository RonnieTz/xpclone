import React from 'react';
import { useDispatch } from 'react-redux';
import {
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  setTaskbarAnimationTarget,
  closeModalWindow,
} from '@/lib/slices/windowsSlice';
import { removeTaskbarItem } from '@/lib/slices/taskbarSlice';
import { WindowState } from '@/lib/slices/windowsSlice';
import { useTaskbarPosition } from './useTaskbarPosition';
import { getIconPath } from '@/lib/iconMapping';
import Image from 'next/image';

interface WindowTitleBarProps {
  window: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
  isDisabled?: boolean;
}

const WindowTitleBar: React.FC<WindowTitleBarProps> = ({
  window,
  onMouseDown,
  isDragging,
  isDisabled = false,
}) => {
  const dispatch = useDispatch();
  const { getTaskbarItemPosition } = useTaskbarPosition();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.isModal) {
      dispatch(closeModalWindow(window.id));
    } else {
      dispatch(closeWindow(window.id));
      dispatch(removeTaskbarItem(window.id));
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Modal windows typically can't be minimized
    if (window.isModal) {
      return;
    }

    // Get taskbar position for animation
    const taskbarPosition = getTaskbarItemPosition(window.id);
    if (taskbarPosition) {
      dispatch(
        setTaskbarAnimationTarget({
          id: window.id,
          target: taskbarPosition,
        })
      );
    }

    dispatch(minimizeWindow(window.id));
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Modal windows typically can't be maximized
    if (window.isModal) {
      return;
    }

    dispatch(maximizeWindow(window.id));
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Modal windows typically can't be maximized
    if (window.isModal) {
      return;
    }

    dispatch(maximizeWindow(window.id));
  };

  return (
    <div
      className={`flex items-center justify-between h-8 px-2 bg-center ${
        isDragging ? 'cursor-grabbing' : ''
      } ${window.isActive ? '' : 'opacity-75'} ${
        isDisabled ? 'pointer-events-none' : ''
      }`}
      style={{
        backgroundImage: 'url(/header.png)',
        backgroundSize: 'auto 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        boxShadow:
          'inset 2px 0 4px rgba(0, 20, 60, 0.6), inset -2px 0 4px rgba(0, 20, 60, 0.6)',
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center">
        <Image
          src={`/${getIconPath(window.icon)}`}
          alt={window.title}
          width={16}
          height={16}
          className="mr-2 object-contain"
        />
        <span className="text-white text-sm font-medium truncate">
          {window.title}
        </span>
      </div>

      <div className="flex items-center space-x-0.5">
        {/* Only show minimize button for non-modal windows */}
        {!window.isModal && (
          <button
            className="w-6 h-6 flex items-center justify-center hover:brightness-125 transition-all rounded-none"
            onClick={handleMinimize}
            title="Minimize"
            disabled={isDisabled}
          >
            <Image
              src="/Minimize.png"
              alt="Minimize"
              width={24}
              height={24}
              className="object-cover w-full h-full"
            />
          </button>
        )}

        {/* Only show maximize button for non-modal windows */}
        {!window.isModal && (
          <button
            className="w-6 h-6 flex items-center justify-center hover:brightness-125 transition-all rounded-none"
            onClick={handleMaximize}
            title={window.isMaximized ? 'Restore' : 'Maximize'}
            disabled={isDisabled}
          >
            <Image
              src={window.isMaximized ? '/Restore.png' : '/Maximize.png'}
              alt={window.isMaximized ? 'Restore' : 'Maximize'}
              width={24}
              height={24}
              className="object-cover w-full h-full"
            />
          </button>
        )}

        <button
          className="w-6 h-6 flex items-center justify-center hover:brightness-125 transition-all rounded-none"
          onClick={handleClose}
          title="Close"
          disabled={isDisabled}
        >
          <Image
            src="/Exit.png"
            alt="Close"
            width={24}
            height={24}
            className="object-cover w-full h-full"
          />
        </button>
      </div>
    </div>
  );
};

export default WindowTitleBar;
