import { WindowState } from '../types/windowTypes';

/**
 * Check if a window has any open modal children
 */
export const hasOpenModalChildren = (
  parentWindowId: string,
  windows: WindowState[]
): boolean => {
  return windows.some(
    (window) =>
      window.parentWindowId === parentWindowId &&
      window.isModal &&
      !window.isMinimized
  );
};

/**
 * Get all modal children of a window
 */
export const getModalChildren = (
  parentWindowId: string,
  windows: WindowState[]
): WindowState[] => {
  return windows.filter(
    (window) =>
      window.parentWindowId === parentWindowId &&
      window.isModal &&
      !window.isMinimized
  );
};

/**
 * Check if a window should be disabled due to modal children
 */
export const isWindowDisabled = (
  windowId: string,
  windows: WindowState[]
): boolean => {
  return hasOpenModalChildren(windowId, windows);
};

/**
 * Get the topmost modal window for a parent
 */
export const getTopmostModal = (
  parentWindowId: string,
  windows: WindowState[]
): WindowState | null => {
  const modalChildren = getModalChildren(parentWindowId, windows);
  if (modalChildren.length === 0) return null;

  return modalChildren.reduce((topmost, current) =>
    current.zIndex > topmost.zIndex ? current : topmost
  );
};

/**
 * Calculate centered position for a modal relative to its parent
 */
export const calculateModalPosition = (
  parentWindow: WindowState,
  modalWidth: number,
  modalHeight: number
): { x: number; y: number } => {
  const parentCenterX = parentWindow.x + parentWindow.width / 2;
  const parentCenterY = parentWindow.y + parentWindow.height / 2;

  return {
    x: Math.max(0, parentCenterX - modalWidth / 2),
    y: Math.max(0, parentCenterY - modalHeight / 2),
  };
};

/**
 * Find all windows that should be disabled when a modal is open
 */
export const getDisabledWindowIds = (windows: WindowState[]): string[] => {
  const disabledIds: string[] = [];

  windows.forEach((window) => {
    if (hasOpenModalChildren(window.id, windows)) {
      disabledIds.push(window.id);
    }
  });

  return disabledIds;
};
