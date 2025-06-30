import { configureStore } from '@reduxjs/toolkit';
import desktopSlice from './slices/desktopSlice';
import taskbarSlice from './slices/taskbarSlice';
import startMenuSlice from './slices/startMenuSlice';
import windowsSlice from './slices/windowsSlice';
import tooltipReducer from './slices/tooltipSlice';
import folderOptionsReducer from './slices/folderOptionsSlice';
import navigationReducer from './slices/navigationSlice';
import folderPositionsReducer from './slices/folderPositionsSlice';

export const store = configureStore({
  reducer: {
    desktop: desktopSlice,
    taskbar: taskbarSlice,
    startMenu: startMenuSlice,
    windows: windowsSlice,
    tooltip: tooltipReducer,
    folderOptions: folderOptionsReducer,
    navigation: navigationReducer,
    folderPositions: folderPositionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the action that causes the serialization error
        ignoredActionTypes: ['taskbar/syncTaskbarWithWindows'],
        // Ignore Date objects in fileSystemItem fields
        ignoredPaths: ['desktop.icons'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
