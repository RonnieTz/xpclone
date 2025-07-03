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
    // 1. Current window-specific positions (highest priority)
    // 2. Legacy global positions (medium priority)
    // 3. OTHER window positions ONLY if current window has NO positions at all
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

      // Check legacy global positions second (before inheriting from other windows)
      const globalPositions =
        state.folderPositions.folderPositions[normalizedPath];
      if (globalPositions && Object.keys(globalPositions).length > 0) {
        return globalPositions;
      }

      // ONLY inherit from other windows if current window has NO data at all
      // This prevents conflicts when items have been moved and positions cleared
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
            // Only inherit if we have absolutely no position data for this window/folder combo
            // Check both window-specific and global positions are empty
            const hasCurrentWindowData =
              (currentWindowPositions &&
                Object.keys(currentWindowPositions).length > 0) ||
              (globalPositions && Object.keys(globalPositions).length > 0);

            if (!hasCurrentWindowData) {
              return otherWindowPositions;
            }
          }
        }
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
