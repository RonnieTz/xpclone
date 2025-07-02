import { Middleware } from '@reduxjs/toolkit';
import { clearWindowPositions } from '@/lib/slices/folderPositionsSlice';

// Define the root state type here to avoid circular reference
interface AppRootState {
  folderPositions: {
    windowFolderPositions: Record<
      string,
      Record<string, { x: number; y: number }>
    >;
    folderPositions: Record<string, Record<string, { x: number; y: number }>>;
  };
}

// Middleware to clean up window-specific data when windows are closed
export const windowCleanupMiddleware: Middleware<{}, AppRootState> =
  (store) => (next) => (action) => {
    // Check if this is a closeWindow action
    if (
      typeof action === 'object' &&
      action !== null &&
      'type' in action &&
      action.type === 'windows/closeWindow'
    ) {
      const windowId = (action as any).payload as string;

      // Dispatch the cleanup action for window-specific positions
      store.dispatch(clearWindowPositions(windowId));
    }

    // Continue with the original action
    return next(action);
  };
