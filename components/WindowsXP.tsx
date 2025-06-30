'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  syncTaskbarWithWindows,
  setStartButtonPressed,
} from '@/lib/slices/taskbarSlice';
import { setStartMenuOpen } from '@/lib/slices/startMenuSlice';
import { unfocusAllWindows, WindowState } from '@/lib/slices/windowsSlice';
import { clearSelection } from '@/lib/slices/desktopSlice';
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
  const { selectedIconIds } = useSelector((state: RootState) => state.desktop);

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

  // Handle global clicks for start menu and window focus
  const handleGlobalClick = (e: React.MouseEvent) => {
    const target = e.target as Element;

    // Close start menu when clicking outside
    if (startMenuOpen && !target.closest('[data-start-menu]')) {
      dispatch(setStartMenuOpen(false));
      dispatch(setStartButtonPressed(false)); // Reset start button state
    }

    // Clear desktop icon selection when clicking outside of desktop icons
    const clickedOnDesktopIcon = target.closest('[data-desktop-icon]');
    if (!clickedOnDesktopIcon && selectedIconIds.length > 0) {
      dispatch(clearSelection());
    }

    // Unfocus windows when clicking outside any window (but not on taskbar or start menu)
    const clickedOnWindow = target.closest('[data-window]');
    const clickedOnTaskbar = target.closest('[data-taskbar]');
    const clickedOnStartMenu = target.closest('[data-start-menu]');

    if (!clickedOnWindow && !clickedOnTaskbar && !clickedOnStartMenu) {
      // Only unfocus if there are active windows and we clicked on desktop/empty space
      const hasActiveWindow = windows.some((window) => window.isActive);
      if (hasActiveWindow) {
        dispatch(unfocusAllWindows());
      }
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
