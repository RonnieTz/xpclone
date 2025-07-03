import { Middleware } from '@reduxjs/toolkit';
import { clearWindowPositions } from '@/lib/slices/folderPositionsSlice';
import { RootState } from '../store';

interface WindowCleanupAction {
  type: string;
  payload: {
    windowId: string;
  };
}

// Middleware to clean up window-specific data when windows are closed
export const windowCleanupMiddleware: Middleware<
  Record<string, never>,
  RootState
> = (store) => (next) => (action) => {
  // Handle window cleanup logic here
  const result = next(action);

  // Type guard to check if this is a window cleanup action
  const isWindowCleanupAction = (
    action: unknown
  ): action is WindowCleanupAction => {
    return (
      action !== null &&
      typeof action === 'object' &&
      'type' in action &&
      typeof (action as { type?: unknown }).type === 'string' &&
      'payload' in action &&
      (action as { payload?: unknown }).payload !== null &&
      typeof (action as { payload?: unknown }).payload === 'object' &&
      'windowId' in ((action as { payload?: unknown }).payload as object)
    );
  };

  // Perform cleanup operations after the action
  // Only trigger cleanup for window close actions, and avoid infinite loops
  if (isWindowCleanupAction(action) && action.type === 'windows/closeWindow') {
    // Cleanup logic for closed windows
    // Use setTimeout to defer the cleanup dispatch and break the synchronous chain
    setTimeout(() => {
      store.dispatch(clearWindowPositions(action.payload.windowId));
    }, 0);
  }

  return result;
};
