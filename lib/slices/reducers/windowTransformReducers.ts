import { PayloadAction } from '@reduxjs/toolkit';
import {
  WindowsState,
  WindowPositionPayload,
  WindowSizePayload,
} from '../types/windowTypes';
import {
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
} from '../constants/windowConstants';

export const moveWindowReducer = (
  state: WindowsState,
  action: PayloadAction<WindowPositionPayload>
) => {
  const window = state.windows.find((w) => w.id === action.payload.id);
  if (window && !window.isMaximized) {
    window.x = action.payload.x;
    window.y = action.payload.y;
  }
};

export const resizeWindowReducer = (
  state: WindowsState,
  action: PayloadAction<WindowSizePayload>
) => {
  const window = state.windows.find((w) => w.id === action.payload.id);
  if (window && window.isResizable && !window.isMaximized) {
    window.width = Math.max(MIN_WINDOW_WIDTH, action.payload.width);
    window.height = Math.max(MIN_WINDOW_HEIGHT, action.payload.height);
  }
};
