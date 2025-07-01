import { DesktopIcon } from '@/lib/slices/desktopSlice';

/**
 * Creates consistent visual ordering used by both mouse and keyboard navigation
 * Sort by rows first (top to bottom), then by columns (left to right)
 */
export const getVisuallyOrderedIcons = (icons: DesktopIcon[]) => {
  return [...icons].sort((a, b) => {
    // Sort by rows first (top to bottom), then by columns (left to right)
    if (Math.abs(a.y - b.y) < 40) {
      return a.x - b.x; // Same row, sort by x
    }
    return a.y - b.y; // Different rows, sort by y
  });
};

/**
 * Calculates default grid position for desktop icons
 */
export const calculateDefaultIconPosition = (index: number) => {
  const col = Math.floor(index / 8); // 8 icons per column
  const row = index % 8;
  const x = col * 100;
  const y = row * 80;
  return { x, y };
};
