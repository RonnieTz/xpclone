import { FileItem } from '../FolderContent/types';
import { NavigationDirection, FileWithPosition } from './types';

// Calculate default grid position for a file based on view mode and index
export const getDefaultGridPosition = (index: number, viewMode: string) => {
  switch (viewMode) {
    case 'icons':
      const itemWidth = 80;
      const itemHeight = 80;
      const padding = 8;
      const itemsPerRow = Math.floor(
        (window.innerWidth - 300) / (itemWidth + padding)
      );

      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;

      return {
        x: col * (itemWidth + padding) + padding,
        y: row * (itemHeight + padding) + padding,
      };

    case 'list':
    case 'details':
    case 'thumbnails':
    default:
      return { x: 0, y: index * 20 }; // Simple linear positioning for other views
  }
};

// Get files with their actual visual positions
export const getFilesWithPositions = (
  files: FileItem[],
  itemPositions: Record<string, { x: number; y: number }> | undefined,
  viewMode: string
): FileWithPosition[] => {
  return files.map((file, index) => {
    // Use actual position if available, otherwise use default grid position
    const position =
      itemPositions?.[file.id] || getDefaultGridPosition(index, viewMode);

    return {
      file,
      index,
      x: position.x,
      y: position.y,
    };
  });
};

// Calculate distance between two points
export const calculateDistance = (
  from: FileWithPosition,
  to: FileWithPosition,
  direction: NavigationDirection
): number => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  // For vertical movement, prioritize vertical distance but consider horizontal alignment
  if (direction === 'up' || direction === 'down') {
    return dy + dx * 0.1; // Small horizontal penalty to prefer aligned files
  }
  // For horizontal movement, prioritize horizontal distance but consider vertical alignment
  else {
    return dx + dy * 0.1; // Small vertical penalty to prefer aligned files
  }
};
