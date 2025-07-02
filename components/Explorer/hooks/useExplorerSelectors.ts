import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface UseExplorerSelectorsReturn {
  folderOptions: ReturnType<
    typeof import('@/lib/store')['store']['getState']
  >['folderOptions']['options'];
  persistentPositions: Record<string, { x: number; y: number }>;
}

// Utility function to normalize folder paths (same as in folderPositionsSlice)
const normalizeFolderPath = (path: string): string => {
  if (!path) return '';
  // Remove trailing slashes and normalize backslashes
  return path
    .replace(/[\\\/]+$/, '')
    .replace(/\//g, '\\')
    .trim();
};

// Create window-specific key
const createWindowFolderKey = (
  windowId: string,
  folderPath: string
): string => {
  const normalizedPath = normalizeFolderPath(folderPath);
  return `${windowId}:${normalizedPath}`;
};

export const useExplorerSelectors = (
  currentPath: string,
  windowId?: string // Add windowId parameter
): UseExplorerSelectorsReturn => {
  const folderOptions = useSelector(
    (state: RootState) => state.folderOptions.options
  );

  const persistentPositions = useSelector((state: RootState) => {
    const normalizedPath = normalizeFolderPath(currentPath);

    // Strategy: Try to find positions in this order:
    // 1. Current window-specific positions
    // 2. Any other window's positions for this folder (shared positioning)
    // 3. Legacy global positions
    // 4. Empty object if none found

    if (windowId) {
      // Check current window-specific positions first
      const windowFolderKey = createWindowFolderKey(windowId, currentPath);
      const currentWindowPositions =
        state.folderPositions.windowFolderPositions[windowFolderKey];

      if (
        currentWindowPositions &&
        Object.keys(currentWindowPositions).length > 0
      ) {
        return currentWindowPositions;
      }

      // If no positions for current window, look for positions from other windows viewing same folder
      const allWindowKeys = Object.keys(
        state.folderPositions.windowFolderPositions
      );
      for (const key of allWindowKeys) {
        // Check if this key is for the same folder but different window
        if (key.endsWith(`:${normalizedPath}`) && key !== windowFolderKey) {
          const otherWindowPositions =
            state.folderPositions.windowFolderPositions[key];
          if (
            otherWindowPositions &&
            Object.keys(otherWindowPositions).length > 0
          ) {
            // Copy these positions to current window for future use
            return otherWindowPositions;
          }
        }
      }

      // Fallback to legacy global positions
      const globalPositions =
        state.folderPositions.folderPositions[normalizedPath];
      if (globalPositions && Object.keys(globalPositions).length > 0) {
        return globalPositions;
      }
    } else {
      // Fallback to legacy global positions when no windowId
      const globalPositions =
        state.folderPositions.folderPositions[normalizedPath];
      if (globalPositions && Object.keys(globalPositions).length > 0) {
        return globalPositions;
      }
    }

    return {};
  });

  return {
    folderOptions,
    persistentPositions,
  };
};
