import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExplorerBarState } from '@/components/Explorer/types';

interface ExplorerBarSliceState {
  currentState: ExplorerBarState;
}

const initialState: ExplorerBarSliceState = {
  currentState: 'Default',
};

const explorerBarSlice = createSlice({
  name: 'explorerBar',
  initialState,
  reducers: {
    setExplorerBarState: (state, action: PayloadAction<ExplorerBarState>) => {
      state.currentState = action.payload;
    },
  },
});

export const { setExplorerBarState } = explorerBarSlice.actions;
export default explorerBarSlice.reducer;
