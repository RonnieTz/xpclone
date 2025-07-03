import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface for pending desktop drop positions
export interface PendingDesktopPosition {
  id: string;
  name: string;
  x: number;
  y: number;
  timestamp: number;
}

// Interface for pending folder drop positions
export interface PendingFolderPosition {
  fileId: string;
  fileName: string;
  folderPath: string;
  x: number;
  y: number;
  timestamp: number;
}

interface PendingPositionsState {
  desktopPositions: Record<string, PendingDesktopPosition>; // key is generated ID
  folderPositions: Record<string, PendingFolderPosition>; // key is generated ID
}

const initialState: PendingPositionsState = {
  desktopPositions: {},
  folderPositions: {},
};

// Utility function to normalize folder paths
const normalizeFolderPath = (path: string): string => {
  if (!path) return '';
  return path
    .replace(/[\\\/]+$/, '')
    .replace(/\//g, '\\')
    .trim();
};

const pendingPositionsSlice = createSlice({
  name: 'pendingPositions',
  initialState,
  reducers: {
    addPendingDesktopPosition: (
      state,
      action: PayloadAction<{
        key: string;
        position: Omit<PendingDesktopPosition, 'timestamp'>;
      }>
    ) => {
      const { key, position } = action.payload;
      state.desktopPositions[key] = {
        ...position,
        timestamp: Date.now(),
      };
    },

    addPendingFolderPosition: (
      state,
      action: PayloadAction<{
        key: string;
        position: Omit<PendingFolderPosition, 'timestamp'>;
      }>
    ) => {
      const { key, position } = action.payload;
      state.folderPositions[key] = {
        ...position,
        folderPath: normalizeFolderPath(position.folderPath),
        timestamp: Date.now(),
      };
    },

    removePendingDesktopPosition: (
      state,
      action: PayloadAction<string> // key
    ) => {
      delete state.desktopPositions[action.payload];
    },

    removePendingFolderPosition: (
      state,
      action: PayloadAction<string> // key
    ) => {
      delete state.folderPositions[action.payload];
    },

    clearAllPendingDesktopPositions: (state) => {
      state.desktopPositions = {};
    },

    clearAllPendingFolderPositions: (state) => {
      state.folderPositions = {};
    },

    // Clean up old pending positions (older than 30 seconds)
    cleanupOldPendingPositions: (state) => {
      const now = Date.now();
      const maxAge = 30000; // 30 seconds

      // Clean desktop positions
      Object.keys(state.desktopPositions).forEach((key) => {
        if (now - state.desktopPositions[key].timestamp > maxAge) {
          delete state.desktopPositions[key];
        }
      });

      // Clean folder positions
      Object.keys(state.folderPositions).forEach((key) => {
        if (now - state.folderPositions[key].timestamp > maxAge) {
          delete state.folderPositions[key];
        }
      });
    },

    // Clear pending positions for a specific file
    clearPendingPositionsForFile: (
      state,
      action: PayloadAction<{ fileId: string; fileName?: string }>
    ) => {
      const { fileId, fileName } = action.payload;

      // Clear desktop positions
      Object.keys(state.desktopPositions).forEach((key) => {
        const pos = state.desktopPositions[key];
        if (pos.id === fileId || (fileName && pos.name === fileName)) {
          delete state.desktopPositions[key];
        }
      });

      // Clear folder positions
      Object.keys(state.folderPositions).forEach((key) => {
        const pos = state.folderPositions[key];
        if (pos.fileId === fileId || (fileName && pos.fileName === fileName)) {
          delete state.folderPositions[key];
        }
      });
    },
  },
});

export const {
  addPendingDesktopPosition,
  addPendingFolderPosition,
  removePendingDesktopPosition,
  removePendingFolderPosition,
  clearAllPendingDesktopPositions,
  clearAllPendingFolderPositions,
  cleanupOldPendingPositions,
  clearPendingPositionsForFile,
} = pendingPositionsSlice.actions;

export default pendingPositionsSlice.reducer;
