'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  syncTaskbarWithWindows,
  setStartButtonPressed,
} from '@/lib/slices/taskbarSlice';
import { setStartMenuOpen } from '@/lib/slices/startMenuSlice';
import { WindowState } from '@/lib/slices/windowsSlice';
import Desktop from './Desktop/Desktop';
import Taskbar from './Taskbar/Taskbar';
import StartMenu from './StartMenu/StartMenu';
import Window from './Window/Window';

const WindowsXP: React.FC = () => {
  const dispatch = useDispatch();
  const { windows } = useSelector((state: RootState) => state.windows);
  const { isOpen: startMenuOpen } = useSelector(
    (state: RootState) => state.startMenu
  );

  // Sync taskbar items with windows
  useEffect(() => {
    const taskbarItems = windows.map((window: WindowState) => ({
      id: `taskbar-${window.id}`,
      title: window.title,
      icon: window.icon,
      isActive: window.isActive,
      isMinimized: window.isMinimized,
      windowId: window.id,
    }));

    dispatch(syncTaskbarWithWindows(taskbarItems));
  }, [windows, dispatch]);

  // Close start menu when clicking outside
  const handleGlobalClick = (e: React.MouseEvent) => {
    if (startMenuOpen && !(e.target as Element).closest('[data-start-menu]')) {
      dispatch(setStartMenuOpen(false));
      dispatch(setStartButtonPressed(false)); // Reset start button state
    }
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      onClick={handleGlobalClick}
    >
      {/* Desktop area that clips content above taskbar */}
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden"
        style={{ height: 'calc(100vh - 40px)' }}
      >
        {/* Desktop with icons */}
        <Desktop />

        {/* Windows */}
        {windows.map((window: WindowState) => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      {/* Start Menu */}
      <div data-start-menu>
        <StartMenu />
      </div>

      {/* Taskbar - always on top */}
      <Taskbar />
    </div>
  );
};

export default WindowsXP;
