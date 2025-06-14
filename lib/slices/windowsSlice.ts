import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WindowState {
  id: string;
  title: string;
  content: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  isResizable: boolean;
  zIndex: number;
  // Store previous state for smooth animations
  previousX?: number;
  previousY?: number;
  previousWidth?: number;
  previousHeight?: number;
  isAnimating?: boolean;
  // Taskbar animation properties
  taskbarAnimationTarget?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isMinimizeAnimating?: boolean;
  isRestoreAnimating?: boolean;
}

interface WindowsState {
  windows: WindowState[];
  nextZIndex: number;
  activeWindowId: string | null;
}

const initialState: WindowsState = {
  windows: [],
  nextZIndex: 1000,
  activeWindowId: null,
};

const windowsSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    openWindow: (
      state,
      action: PayloadAction<Omit<WindowState, 'id' | 'zIndex' | 'isActive'>>
    ) => {
      const id = Date.now().toString();
      const newWindow: WindowState = {
        ...action.payload,
        id,
        zIndex: state.nextZIndex,
        isActive: true,
      };

      // Deactivate all other windows
      state.windows.forEach((window) => {
        window.isActive = false;
      });

      state.windows.push(newWindow);
      state.activeWindowId = id;
      state.nextZIndex += 1;
    },
    closeWindow: (state, action: PayloadAction<string>) => {
      const windowIndex = state.windows.findIndex(
        (window) => window.id === action.payload
      );
      if (windowIndex !== -1) {
        state.windows.splice(windowIndex, 1);

        // If this was the active window, activate the top-most remaining window
        if (state.activeWindowId === action.payload) {
          const topWindow = state.windows.reduce(
            (top, window) =>
              !top || window.zIndex > top.zIndex ? window : top,
            null as WindowState | null
          );

          state.activeWindowId = topWindow?.id || null;
          if (topWindow) {
            topWindow.isActive = true;
          }
        }
      }
    },
    focusWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find((w) => w.id === action.payload);
      if (window) {
        // Deactivate all windows
        state.windows.forEach((w) => {
          w.isActive = false;
        });

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
    },
    minimizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find((w) => w.id === action.payload);
      if (window) {
        window.isMinimized = true;
        window.isActive = false;
        window.isMinimizeAnimating = true;

        // Find next active window
        const nextActive = state.windows
          .filter((w) => w.id !== action.payload && !w.isMinimized)
          .reduce(
            (top, w) => (!top || w.zIndex > top.zIndex ? w : top),
            null as WindowState | null
          );

        if (nextActive) {
          nextActive.isActive = true;
          state.activeWindowId = nextActive.id;
        } else {
          state.activeWindowId = null;
        }
      }
    },
    restoreWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find((w) => w.id === action.payload);
      if (window) {
        window.isMinimized = false;
        window.isRestoreAnimating = true;
      }
    },
    maximizeWindow: (state, action: PayloadAction<string>) => {
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
    },
    setWindowAnimating: (
      state,
      action: PayloadAction<{ id: string; isAnimating: boolean }>
    ) => {
      const window = state.windows.find((w) => w.id === action.payload.id);
      if (window) {
        window.isAnimating = action.payload.isAnimating;
      }
    },
    moveWindow: (
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>
    ) => {
      const window = state.windows.find((w) => w.id === action.payload.id);
      if (window && !window.isMaximized) {
        window.x = action.payload.x;
        window.y = action.payload.y;
      }
    },
    resizeWindow: (
      state,
      action: PayloadAction<{ id: string; width: number; height: number }>
    ) => {
      const window = state.windows.find((w) => w.id === action.payload.id);
      if (window && window.isResizable && !window.isMaximized) {
        window.width = Math.max(200, action.payload.width);
        window.height = Math.max(100, action.payload.height);
      }
    },
    setTaskbarAnimationTarget: (
      state,
      action: PayloadAction<{
        id: string;
        target: { x: number; y: number; width: number; height: number };
      }>
    ) => {
      const window = state.windows.find((w) => w.id === action.payload.id);
      if (window) {
        window.taskbarAnimationTarget = action.payload.target;
      }
    },
    setMinimizeAnimating: (
      state,
      action: PayloadAction<{ id: string; isAnimating: boolean }>
    ) => {
      const window = state.windows.find((w) => w.id === action.payload.id);
      if (window) {
        window.isMinimizeAnimating = action.payload.isAnimating;
      }
    },
    setRestoreAnimating: (
      state,
      action: PayloadAction<{ id: string; isAnimating: boolean }>
    ) => {
      const window = state.windows.find((w) => w.id === action.payload.id);
      if (window) {
        window.isRestoreAnimating = action.payload.isAnimating;
      }
    },
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
} = windowsSlice.actions;
export default windowsSlice.reducer;
