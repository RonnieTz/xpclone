import { createSlice } from '@reduxjs/toolkit';
import { WindowsState } from './types/windowTypes';
import { INITIAL_Z_INDEX } from './constants/windowConstants';
import {
  openWindowReducer,
  openOrFocusWindowReducer,
  openModalWindowReducer,
  closeModalWindowReducer,
} from './reducers/windowOpenReducers';
import { closeWindowReducer } from './reducers/windowCloseReducers';
import {
  focusWindowReducer,
  minimizeWindowReducer,
  restoreWindowReducer,
  maximizeWindowReducer,
  unfocusAllWindowsReducer,
} from './reducers/windowStateReducers';
import {
  moveWindowReducer,
  resizeWindowReducer,
} from './reducers/windowTransformReducers';
import {
  setWindowAnimatingReducer,
  setTaskbarAnimationTargetReducer,
  setMinimizeAnimatingReducer,
  setRestoreAnimatingReducer,
  updateWindowTitleAndContentReducer,
  refreshExplorerWindowsReducer,
} from './reducers/windowAnimationReducers';

const initialState: WindowsState = {
  windows: [],
  nextZIndex: INITIAL_Z_INDEX,
  activeWindowId: null,
};

const windowsSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    openWindow: openWindowReducer,
    closeWindow: closeWindowReducer,
    focusWindow: focusWindowReducer,
    minimizeWindow: minimizeWindowReducer,
    restoreWindow: restoreWindowReducer,
    maximizeWindow: maximizeWindowReducer,
    setWindowAnimating: setWindowAnimatingReducer,
    moveWindow: moveWindowReducer,
    resizeWindow: resizeWindowReducer,
    setTaskbarAnimationTarget: setTaskbarAnimationTargetReducer,
    setMinimizeAnimating: setMinimizeAnimatingReducer,
    setRestoreAnimating: setRestoreAnimatingReducer,
    updateWindowTitleAndContent: updateWindowTitleAndContentReducer,
    unfocusAllWindows: unfocusAllWindowsReducer,
    refreshExplorerWindows: refreshExplorerWindowsReducer,
    openOrFocusWindow: openOrFocusWindowReducer,
    openModalWindow: openModalWindowReducer,
    closeModalWindow: closeModalWindowReducer,
  },
});

export const {
  openWindow,
  closeWindow,
  focusWindow,
  minimizeWindow,
  restoreWindow,
  maximizeWindow,
  setWindowAnimating,
  moveWindow,
  resizeWindow,
  setTaskbarAnimationTarget,
  setMinimizeAnimating,
  setRestoreAnimating,
  updateWindowTitleAndContent,
  unfocusAllWindows,
  refreshExplorerWindows,
  openOrFocusWindow,
  openModalWindow,
  closeModalWindow,
} = windowsSlice.actions;
export default windowsSlice.reducer;

// Re-export types for convenience
export type { WindowState, WindowsState } from './types/windowTypes';
