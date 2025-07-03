import { WindowState } from '../types/windowTypes';

/**
 * Find the top-most window (highest z-index) from a list of windows
 */
export const findTopMostWindow = (
  windows: WindowState[]
): WindowState | null => {
  return windows.reduce(
    (top, window) => (!top || window.zIndex > top.zIndex ? window : top),
    null as WindowState | null
  );
};

/**
 * Find the next active window after excluding a specific window
 */
export const findNextActiveWindow = (
  windows: WindowState[],
  excludeId: string
): WindowState | null => {
  return windows
    .filter((w) => w.id !== excludeId && !w.isMinimized)
    .reduce(
      (top, w) => (!top || w.zIndex > top.zIndex ? w : top),
      null as WindowState | null
    );
};

/**
 * Check if a window with the same content already exists
 */
export const findWindowByContent = (
  windows: WindowState[],
  content: string
): WindowState | undefined => {
  return windows.find((window) => window.content === content);
};

/**
 * Find an Explorer window that has navigated to the target content in its history.
 * This is used for openOrFocusWindow to find existing windows that have visited
 * the target folder, even if they've navigated elsewhere.
 */
export const findExplorerWindowByContentOrHistory = (
  windows: WindowState[],
  content: string,
  navigationHistory?: Array<{
    windowId: string;
    history: Array<{ path: string; title: string }>;
    currentIndex: number;
  }>
): WindowState | undefined => {
  // First check current content (exact match)
  const exactMatch = windows.find((window) => window.content === content);
  if (exactMatch) {
    return exactMatch;
  }

  // For Explorer windows, check navigation history
  if (isExplorerWindow({ content } as WindowState) && navigationHistory) {
    // Extract the path from the target content
    const targetPath = extractPathFromContent(content);
    if (targetPath) {
      // Find Explorer windows that have this path in their navigation history
      for (const window of windows) {
        if (isExplorerWindow(window)) {
          const windowNav = navigationHistory.find(
            (nav) => nav.windowId === window.id
          );
          if (windowNav) {
            // Check if this window has visited the target path
            const hasVisitedPath = windowNav.history.some((entry) => {
              const entryContent = getContentFromPath(entry.path);
              return entryContent === content;
            });
            if (hasVisitedPath) {
              return window;
            }
          }
        }
      }
    }
  }

  return undefined;
};

/**
 * Extract path from window content like "Folder: C:\Path"
 */
const extractPathFromContent = (content: string): string | null => {
  if (content.includes('My Computer')) return 'My Computer';
  if (content.includes('Recycle Bin')) return 'Recycle Bin';

  const match = content.match(/Folder:\s*(.+)/);
  return match ? match[1] : null;
};

/**
 * Convert path back to content format
 */
const getContentFromPath = (path: string): string => {
  if (path === 'My Computer') return 'My Computer';
  if (path === 'Recycle Bin') return 'Recycle Bin';
  return `Folder: ${path}`;
};

/**
 * Deactivate all windows in the state
 */
export const deactivateAllWindows = (windows: WindowState[]): void => {
  windows.forEach((window) => {
    window.isActive = false;
  });
};

/**
 * Check if a window is an Explorer window based on its content
 */
export const isExplorerWindow = (window: WindowState): boolean => {
  return (
    window.content.includes('Folder:') ||
    window.content.includes('My Computer') ||
    window.content.includes('Recycle Bin')
  );
};

/**
 * Create a new window object
 */
export const createWindow = (title: string, content: string) => {
  return {
    id: Date.now().toString(),
    title,
    content,
    isActive: true,
  };
};
