import { PayloadAction } from '@reduxjs/toolkit';
import { WindowsState, CreateWindowPayload } from '../types/windowTypes';
import {
  deactivateAllWindows,
  findWindowByContent,
} from '../utils/windowUtils';

export const openWindowReducer = (
  state: WindowsState,
  action: PayloadAction<CreateWindowPayload>
) => {
  const id = Date.now().toString();
  const newWindow = {
    ...action.payload,
    id,
    zIndex: state.nextZIndex,
    isActive: true,
  };

  // Deactivate all other windows
  deactivateAllWindows(state.windows);

  state.windows.push(newWindow);
  state.activeWindowId = id;
  state.nextZIndex += 1;
};

export const openOrFocusWindowReducer = (
  state: WindowsState,
  action: PayloadAction<CreateWindowPayload>
) => {
  // Check if a window with the same content already exists
  const existingWindow = findWindowByContent(
    state.windows,
    action.payload.content
  );

  if (existingWindow) {
    // Focus the existing window instead of opening a new one
    deactivateAllWindows(state.windows);

    // Activate and bring to front
    existingWindow.isActive = true;
    existingWindow.zIndex = state.nextZIndex;
    state.activeWindowId = existingWindow.id;
    state.nextZIndex += 1;

    // Restore if minimized
    if (existingWindow.isMinimized) {
      existingWindow.isMinimized = false;
      existingWindow.isRestoreAnimating = true;
    }
  } else {
    // No existing window found, create a new one
    openWindowReducer(state, action);
  }
};
