import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FolderOptions {
  showAddressBar: boolean;
  showStandardBar: boolean;
  showStatusBar: boolean;
  showTaskPane: boolean;
  showFolderList: boolean;
  viewType: 'tiles' | 'icons' | 'list' | 'details' | 'thumbnails';
  arrangeIconsBy: 'name' | 'size' | 'type' | 'modified';
  showHiddenFiles: boolean;
  showFileExtensions: boolean;
}

interface FolderOptionsState {
  options: FolderOptions;
}

const initialState: FolderOptionsState = {
  options: {
    showAddressBar: true,
    showStandardBar: true,
    showStatusBar: true,
    showTaskPane: false,
    showFolderList: false,
    viewType: 'tiles',
    arrangeIconsBy: 'name',
    showHiddenFiles: false,
    showFileExtensions: false,
  },
};

const folderOptionsSlice = createSlice({
  name: 'folderOptions',
  initialState,
  reducers: {
    setShowAddressBar: (state, action: PayloadAction<boolean>) => {
      state.options.showAddressBar = action.payload;
    },
    setShowStandardBar: (state, action: PayloadAction<boolean>) => {
      state.options.showStandardBar = action.payload;
    },
    setShowStatusBar: (state, action: PayloadAction<boolean>) => {
      state.options.showStatusBar = action.payload;
    },
    setShowTaskPane: (state, action: PayloadAction<boolean>) => {
      state.options.showTaskPane = action.payload;
    },
    setShowFolderList: (state, action: PayloadAction<boolean>) => {
      state.options.showFolderList = action.payload;
    },
    setViewType: (state, action: PayloadAction<FolderOptions['viewType']>) => {
      state.options.viewType = action.payload;
    },
    setArrangeIconsBy: (
      state,
      action: PayloadAction<FolderOptions['arrangeIconsBy']>
    ) => {
      state.options.arrangeIconsBy = action.payload;
    },
    setShowHiddenFiles: (state, action: PayloadAction<boolean>) => {
      state.options.showHiddenFiles = action.payload;
    },
    setShowFileExtensions: (state, action: PayloadAction<boolean>) => {
      state.options.showFileExtensions = action.payload;
    },
    toggleAddressBar: (state) => {
      state.options.showAddressBar = !state.options.showAddressBar;
    },
    toggleStandardBar: (state) => {
      state.options.showStandardBar = !state.options.showStandardBar;
    },
    resetToDefaults: (state) => {
      state.options = initialState.options;
    },
  },
});

export const {
  setShowAddressBar,
  setShowStandardBar,
  setShowStatusBar,
  setShowTaskPane,
  setShowFolderList,
  setViewType,
  setArrangeIconsBy,
  setShowHiddenFiles,
  setShowFileExtensions,
  toggleAddressBar,
  toggleStandardBar,
  resetToDefaults,
} = folderOptionsSlice.actions;

export default folderOptionsSlice.reducer;
