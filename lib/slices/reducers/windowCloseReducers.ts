import { PayloadAction } from '@reduxjs/toolkit';
import { WindowsState } from '../types/windowTypes';
import { findTopMostWindow } from '../utils/windowUtils';

export const closeWindowReducer = (
  state: WindowsState,
  action: PayloadAction<string>
) => {
  const windowIndex = state.windows.findIndex(
    (window) => window.id === action.payload
  );
  if (windowIndex !== -1) {
    state.windows.splice(windowIndex, 1);

    // If this was the active window, activate the top-most remaining window
    if (state.activeWindowId === action.payload) {
      const topWindow = findTopMostWindow(state.windows);

      state.activeWindowId = topWindow?.id || null;
      if (topWindow) {
        topWindow.isActive = true;
      }
    }
  }
};
