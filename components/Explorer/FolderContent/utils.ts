/**
 * Calculate default grid positions for items that don't have custom positions
 */
export const calculateDefaultPosition = (index: number) => {
  const itemWidth = 80;
  const itemHeight = 80;
  const padding = 8;
  const itemsPerRow = Math.floor(
    (window.innerWidth - 300) / (itemWidth + padding)
  ); // Account for sidebar

  const row = Math.floor(index / itemsPerRow);
  const col = index % itemsPerRow;

  return {
    x: col * (itemWidth + padding) + padding,
    y: row * (itemHeight + padding) + padding,
  };
};

/**
 * Normalize folder paths to ensure consistent matching
 */
export const normalizeFolderPath = (path: string) => {
  if (!path) return '';
  // Remove trailing slashes and normalize backslashes
  return path
    .replace(/[\\\/]+$/, '')
    .replace(/\//g, '\\')
    .trim();
};
