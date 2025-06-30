import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Window size constraints
const MIN_WINDOW_WIDTH = 550;
const MIN_WINDOW_HEIGHT = 150;

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
  refreshCounter?: number; // Added refresh counter
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
        window.width = Math.max(MIN_WINDOW_WIDTH, action.payload.width);
        window.height = Math.max(MIN_WINDOW_HEIGHT, action.payload.height);
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
    updateWindowTitleAndContent: (
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>
    ) => {
      const window = state.windows.find((w) => w.id === action.payload.id);
      if (window) {
        window.title = action.payload.title;
        window.content = action.payload.content;
      }
    },
    unfocusAllWindows: (state) => {
      // Deactivate all windows
      state.windows.forEach((w) => {
        w.isActive = false;
      });
      state.activeWindowId = null;
    },
    refreshExplorerWindows: (state) => {
      // Increment a refresh counter for all Explorer windows to trigger re-renders
      // This will be used by Explorer components to detect when they need to refresh
      state.windows.forEach((window) => {
        if (
          window.content.includes('Folder:') ||
          window.content.includes('My Computer') ||
          window.content.includes('Recycle Bin')
        ) {
          // Add or increment refresh counter
          window.refreshCounter = (window.refreshCounter || 0) + 1;
        }
      });
    },
    openOrFocusWindow: (
      state,
      action: PayloadAction<Omit<WindowState, 'id' | 'zIndex' | 'isActive'>>
    ) => {
      // Check if a window with the same content already exists
      const existingWindow = state.windows.find(
        (window) => window.content === action.payload.content
      );

      if (existingWindow) {
        // Focus the existing window instead of opening a new one
        // Deactivate all windows
        state.windows.forEach((w) => {
          w.isActive = false;
        });

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
  updateWindowTitleAndContent,
  unfocusAllWindows,
  refreshExplorerWindows,
  openOrFocusWindow,
} = windowsSlice.actions;
export default windowsSlice.reducer;
