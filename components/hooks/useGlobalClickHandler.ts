import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { setStartButtonPressed } from '@/lib/slices/taskbarSlice';
import { setStartMenuOpen } from '@/lib/slices/startMenuSlice';
import { unfocusAllWindows } from '@/lib/slices/windowsSlice';
import { clearSelection } from '@/lib/slices/desktopSlice';

export const useGlobalClickHandler = () => {
  const dispatch = useDispatch();
  const { isOpen: startMenuOpen } = useSelector(
    (state: RootState) => state.startMenu
  );
  const { selectedIconIds } = useSelector((state: RootState) => state.desktop);
  const { windows } = useSelector((state: RootState) => state.windows);

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

  return { handleGlobalClick };
};
