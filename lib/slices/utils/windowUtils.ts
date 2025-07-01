import { WindowState, WindowsState } from '../types/windowTypes';

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
