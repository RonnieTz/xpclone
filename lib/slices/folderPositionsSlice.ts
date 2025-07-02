import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface for item position within a folder
export interface FolderItemPosition {
  fileId: string;
  x: number;
  y: number;
}

// Interface for positions organized by window-specific folder keys
interface FolderPositionsState {
  // Key is "windowId:folderPath", value is map of fileId to position
  windowFolderPositions: Record<
    string,
    Record<string, { x: number; y: number }>
  >;
  // Keep legacy folderPositions for backwards compatibility
  folderPositions: Record<string, Record<string, { x: number; y: number }>>;
}

// Utility function to normalize folder paths for consistent storage
const normalizeFolderPath = (path: string): string => {
  if (!path) return '';
  // Remove trailing slashes and normalize backslashes
  return path
    .replace(/[\\\/]+$/, '')
    .replace(/\//g, '\\')
    .trim();
};

// Create window-specific key
const createWindowFolderKey = (
  windowId: string,
  folderPath: string
): string => {
  const normalizedPath = normalizeFolderPath(folderPath);
  return `${windowId}:${normalizedPath}`;
};

const initialState: FolderPositionsState = {
  windowFolderPositions: {},
  folderPositions: {},
};

const folderPositionsSlice = createSlice({
  name: 'folderPositions',
  initialState,
  reducers: {
    setItemPosition: (
      state,
      action: PayloadAction<{
        folderPath: string;
        fileId: string;
        x: number;
        y: number;
        windowId?: string; // Add optional windowId
      }>
    ) => {
      const { folderPath, fileId, x, y, windowId } = action.payload;

      if (windowId) {
        // Use window-specific positioning
        const windowFolderKey = createWindowFolderKey(windowId, folderPath);

        if (!state.windowFolderPositions[windowFolderKey]) {
          state.windowFolderPositions[windowFolderKey] = {};
        }

        state.windowFolderPositions[windowFolderKey][fileId] = { x, y };
      } else {
        // Fallback to legacy global positioning
        const normalizedPath = normalizeFolderPath(folderPath);

        if (!state.folderPositions[normalizedPath]) {
          state.folderPositions[normalizedPath] = {};
        }

        state.folderPositions[normalizedPath][fileId] = { x, y };
      }
    },

    setMultipleItemPositions: (
      state,
      action: PayloadAction<{
        folderPath: string;
        positions: Record<string, { x: number; y: number }>;
        windowId?: string; // Add optional windowId
      }>
    ) => {
      const { folderPath, positions, windowId } = action.payload;

      if (windowId) {
        // Use window-specific positioning
        const windowFolderKey = createWindowFolderKey(windowId, folderPath);
        state.windowFolderPositions[windowFolderKey] = {
          ...state.windowFolderPositions[windowFolderKey],
          ...positions,
        };
      } else {
        // Fallback to legacy global positioning
        const normalizedPath = normalizeFolderPath(folderPath);
        state.folderPositions[normalizedPath] = {
          ...state.folderPositions[normalizedPath],
          ...positions,
        };
      }
    },

    clearFolderPositions: (
      state,
      action: PayloadAction<{ folderPath: string; windowId?: string }>
    ) => {
      const { folderPath, windowId } = action.payload;

      if (windowId) {
        // Clear window-specific positions
        const windowFolderKey = createWindowFolderKey(windowId, folderPath);
        delete state.windowFolderPositions[windowFolderKey];
      } else {
        // Clear legacy global positions
        const normalizedPath = normalizeFolderPath(folderPath);
        delete state.folderPositions[normalizedPath];
      }
    },

    clearWindowPositions: (
      state,
      action: PayloadAction<string> // windowId
    ) => {
      const windowId = action.payload;
      // Remove all position data for a specific window
      Object.keys(state.windowFolderPositions).forEach((key) => {
        if (key.startsWith(`${windowId}:`)) {
          delete state.windowFolderPositions[key];
        }
      });
    },

    removeItemPosition: (
      state,
      action: PayloadAction<{
        folderPath: string;
        fileId: string;
        windowId?: string;
      }>
    ) => {
      const { folderPath, fileId, windowId } = action.payload;

      if (windowId) {
        // Remove from window-specific positions
        const windowFolderKey = createWindowFolderKey(windowId, folderPath);

        if (state.windowFolderPositions[windowFolderKey]) {
          delete state.windowFolderPositions[windowFolderKey][fileId];

          // Clean up empty window-folder entries
          if (
            Object.keys(state.windowFolderPositions[windowFolderKey]).length ===
            0
          ) {
            delete state.windowFolderPositions[windowFolderKey];
          }
        }
      } else {
        // Remove from legacy global positions
        const normalizedPath = normalizeFolderPath(folderPath);

        if (state.folderPositions[normalizedPath]) {
          delete state.folderPositions[normalizedPath][fileId];

          // Clean up empty folder entries
          if (Object.keys(state.folderPositions[normalizedPath]).length === 0) {
            delete state.folderPositions[normalizedPath];
          }
        }
      }
    },
  },
});

export const {
  setItemPosition,
  setMultipleItemPositions,
  clearFolderPositions,
  clearWindowPositions,
  removeItemPosition,
} = folderPositionsSlice.actions;

export default folderPositionsSlice.reducer;
