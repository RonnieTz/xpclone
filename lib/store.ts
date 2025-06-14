import { configureStore } from '@reduxjs/toolkit';
import desktopSlice from './slices/desktopSlice';
import taskbarSlice from './slices/taskbarSlice';
import startMenuSlice from './slices/startMenuSlice';
import windowsSlice from './slices/windowsSlice';
import tooltipReducer from './slices/tooltipSlice';

export const store = configureStore({
  reducer: {
    desktop: desktopSlice,
    taskbar: taskbarSlice,
    startMenu: startMenuSlice,
    windows: windowsSlice,
    tooltip: tooltipReducer,
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
