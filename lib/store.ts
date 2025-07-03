import { configureStore } from '@reduxjs/toolkit';
import desktopSlice from './slices/desktopSlice';
import taskbarSlice from './slices/taskbarSlice';
import startMenuSlice from './slices/startMenuSlice';
import windowsSlice from './slices/windowsSlice';
import tooltipReducer from './slices/tooltipSlice';
import folderOptionsReducer from './slices/folderOptionsSlice';
import navigationReducer from './slices/navigationSlice';
import folderPositionsReducer from './slices/folderPositionsSlice';
import pendingPositionsReducer from './slices/pendingPositionsSlice';
import { windowCleanupMiddleware } from './middleware/windowCleanupMiddleware';

// Define the root reducer first
const rootReducer = {
  desktop: desktopSlice,
  taskbar: taskbarSlice,
  startMenu: startMenuSlice,
  windows: windowsSlice,
  tooltip: tooltipReducer,
  folderOptions: folderOptionsReducer,
  navigation: navigationReducer,
  folderPositions: folderPositionsReducer,
  pendingPositions: pendingPositionsReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the action that causes the serialization error
        ignoredActionTypes: ['taskbar/syncTaskbarWithWindows'],
        // Ignore Date objects in fileSystemItem fields
        ignoredPaths: ['desktop.icons'],
      },
    }).concat(windowCleanupMiddleware), // Add the window cleanup middleware
});

// Extract RootState type from the root reducer instead of the store
export type RootState = {
  [K in keyof typeof rootReducer]: ReturnType<(typeof rootReducer)[K]>;
};
// Properly type AppDispatch to include async thunks
export type AppDispatch = typeof store.dispatch;
