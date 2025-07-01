import { PayloadAction } from '@reduxjs/toolkit';
import {
  WindowsState,
  WindowAnimationPayload,
  TaskbarAnimationPayload,
  WindowContentPayload,
} from '../types/windowTypes';
import { isExplorerWindow } from '../utils/windowUtils';

export const setWindowAnimatingReducer = (
  state: WindowsState,
  action: PayloadAction<WindowAnimationPayload>
) => {
  const window = state.windows.find((w) => w.id === action.payload.id);
  if (window) {
    window.isAnimating = action.payload.isAnimating;
  }
};

export const setTaskbarAnimationTargetReducer = (
  state: WindowsState,
  action: PayloadAction<TaskbarAnimationPayload>
) => {
  const window = state.windows.find((w) => w.id === action.payload.id);
  if (window) {
    window.taskbarAnimationTarget = action.payload.target;
  }
};

export const setMinimizeAnimatingReducer = (
  state: WindowsState,
  action: PayloadAction<WindowAnimationPayload>
) => {
  const window = state.windows.find((w) => w.id === action.payload.id);
  if (window) {
    window.isMinimizeAnimating = action.payload.isAnimating;
  }
};

export const setRestoreAnimatingReducer = (
  state: WindowsState,
  action: PayloadAction<WindowAnimationPayload>
) => {
  const window = state.windows.find((w) => w.id === action.payload.id);
  if (window) {
    window.isRestoreAnimating = action.payload.isAnimating;
  }
};

export const updateWindowTitleAndContentReducer = (
  state: WindowsState,
  action: PayloadAction<WindowContentPayload>
) => {
  const window = state.windows.find((w) => w.id === action.payload.id);
  if (window) {
    window.title = action.payload.title;
    window.content = action.payload.content;
  }
};

export const refreshExplorerWindowsReducer = (state: WindowsState) => {
  // Increment a refresh counter for all Explorer windows to trigger re-renders
  // This will be used by Explorer components to detect when they need to refresh
  state.windows.forEach((window) => {
    if (isExplorerWindow(window)) {
      // Add or increment refresh counter
      window.refreshCounter = (window.refreshCounter || 0) + 1;
    }
  });
};
