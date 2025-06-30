import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface for item position within a folder
export interface FolderItemPosition {
  fileId: string;
  x: number;
  y: number;
}

// Interface for positions organized by folder path
interface FolderPositionsState {
  // Key is folder path, value is map of fileId to position
  folderPositions: Record<string, Record<string, { x: number; y: number }>>;
}

const initialState: FolderPositionsState = {
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
      }>
    ) => {
      const { folderPath, fileId, x, y } = action.payload;

      if (!state.folderPositions[folderPath]) {
        state.folderPositions[folderPath] = {};
      }

      state.folderPositions[folderPath][fileId] = { x, y };
    },

    setMultipleItemPositions: (
      state,
      action: PayloadAction<{
        folderPath: string;
        positions: Record<string, { x: number; y: number }>;
      }>
    ) => {
      const { folderPath, positions } = action.payload;
      state.folderPositions[folderPath] = {
        ...state.folderPositions[folderPath],
        ...positions,
      };
    },

    clearFolderPositions: (state, action: PayloadAction<string>) => {
      delete state.folderPositions[action.payload];
    },

    removeItemPosition: (
      state,
      action: PayloadAction<{ folderPath: string; fileId: string }>
    ) => {
      const { folderPath, fileId } = action.payload;
      if (state.folderPositions[folderPath]) {
        delete state.folderPositions[folderPath][fileId];

        // Clean up empty folder entries
        if (Object.keys(state.folderPositions[folderPath]).length === 0) {
          delete state.folderPositions[folderPath];
        }
      }
    },
  },
});

export const {
  setItemPosition,
  setMultipleItemPositions,
  clearFolderPositions,
  removeItemPosition,
} = folderPositionsSlice.actions;

export default folderPositionsSlice.reducer;
