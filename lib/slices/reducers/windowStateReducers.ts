import { PayloadAction } from '@reduxjs/toolkit';
import { WindowsState } from '../types/windowTypes';
import {
  deactivateAllWindows,
  findNextActiveWindow,
} from '../utils/windowUtils';

export const focusWindowReducer = (
  state: WindowsState,
  action: PayloadAction<string>
) => {
  const window = state.windows.find((w) => w.id === action.payload);
  if (window) {
    // Deactivate all windows
    deactivateAllWindows(state.windows);

    // Activate and bring to front
    window.isActive = true;
    window.zIndex = state.nextZIndex;
    state.activeWindowId = action.payload;
    state.nextZIndex += 1;

    // Restore if minimized
    if (window.isMinimized) {
      window.isMinimized = false;
    }
  }
};

export const minimizeWindowReducer = (
  state: WindowsState,
  action: PayloadAction<string>
) => {
  const window = state.windows.find((w) => w.id === action.payload);
  if (window) {
    window.isMinimized = true;
    window.isActive = false;
    window.isMinimizeAnimating = true;

    // Find next active window
    const nextActive = findNextActiveWindow(state.windows, action.payload);

    if (nextActive) {
      nextActive.isActive = true;
      state.activeWindowId = nextActive.id;
    } else {
      state.activeWindowId = null;
    }
  }
};

export const restoreWindowReducer = (
  state: WindowsState,
  action: PayloadAction<string>
) => {
  const window = state.windows.find((w) => w.id === action.payload);
  if (window) {
    window.isMinimized = false;
    window.isRestoreAnimating = true;
  }
};

export const maximizeWindowReducer = (
  state: WindowsState,
  action: PayloadAction<string>
) => {
  const window = state.windows.find((w) => w.id === action.payload);
  if (window) {
    if (!window.isMaximized) {
      // Store current dimensions before maximizing
      window.previousX = window.x;
      window.previousY = window.y;
      window.previousWidth = window.width;
      window.previousHeight = window.height;
    } else {
      // Restore to previous dimensions
      if (window.previousX !== undefined) window.x = window.previousX;
      if (window.previousY !== undefined) window.y = window.previousY;
      if (window.previousWidth !== undefined)
        window.width = window.previousWidth;
      if (window.previousHeight !== undefined)
        window.height = window.previousHeight;
    }
    window.isMaximized = !window.isMaximized;
    window.isAnimating = true;
  }
};

export const unfocusAllWindowsReducer = (state: WindowsState) => {
  // Deactivate all windows
  deactivateAllWindows(state.windows);
  state.activeWindowId = null;
};
