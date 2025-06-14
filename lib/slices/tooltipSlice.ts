import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TooltipState {
  visibleTooltipId: string | null;
}

const initialState: TooltipState = {
  visibleTooltipId: null,
};

const tooltipSlice = createSlice({
  name: 'tooltip',
  initialState,
  reducers: {
    showTooltip: (state, action: PayloadAction<string>) => {
      state.visibleTooltipId = action.payload;
    },
    hideTooltip: (state) => {
      state.visibleTooltipId = null;
    },
  },
});

export const { showTooltip, hideTooltip } = tooltipSlice.actions;
export default tooltipSlice.reducer;
