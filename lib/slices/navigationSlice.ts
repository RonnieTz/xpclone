import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavigationEntry {
  path: string;
  title: string;
}

export interface NavigationState {
  windowId: string;
  history: NavigationEntry[];
  currentIndex: number;
}

interface NavigationSliceState {
  navigations: NavigationState[];
}

const initialState: NavigationSliceState = {
  navigations: [],
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    initializeNavigation: (
      state,
      action: PayloadAction<{ windowId: string; path: string; title: string }>
    ) => {
      const { windowId, path, title } = action.payload;

      // Remove existing navigation for this window if it exists
      state.navigations = state.navigations.filter(
        (nav) => nav.windowId !== windowId
      );

      // Create new navigation state
      state.navigations.push({
        windowId,
        history: [{ path, title }],
        currentIndex: 0,
      });
    },

    navigateTo: (
      state,
      action: PayloadAction<{ windowId: string; path: string; title: string }>
    ) => {
      const { windowId, path, title } = action.payload;
      const navigation = state.navigations.find(
        (nav) => nav.windowId === windowId
      );

      if (navigation) {
        // Remove any forward history when navigating to a new location
        navigation.history = navigation.history.slice(
          0,
          navigation.currentIndex + 1
        );

        // Add new entry
        navigation.history.push({ path, title });
        navigation.currentIndex = navigation.history.length - 1;
      }
    },

    navigateBack: (state, action: PayloadAction<string>) => {
      const windowId = action.payload;
      const navigation = state.navigations.find(
        (nav) => nav.windowId === windowId
      );

      if (navigation && navigation.currentIndex > 0) {
        navigation.currentIndex -= 1;
      }
    },

    navigateForward: (state, action: PayloadAction<string>) => {
      const windowId = action.payload;
      const navigation = state.navigations.find(
        (nav) => nav.windowId === windowId
      );

      if (
        navigation &&
        navigation.currentIndex < navigation.history.length - 1
      ) {
        navigation.currentIndex += 1;
      }
    },

    clearNavigation: (state, action: PayloadAction<string>) => {
      const windowId = action.payload;
      state.navigations = state.navigations.filter(
        (nav) => nav.windowId !== windowId
      );
    },
  },
});

export const {
  initializeNavigation,
  navigateTo,
  navigateBack,
  navigateForward,
  clearNavigation,
} = navigationSlice.actions;

export default navigationSlice.reducer;
