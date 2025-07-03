import { FileItem } from '../FolderContent/types';
import { NavigationDirection, FileWithPosition } from './types';
import { calculateDistance } from './positionUtils';

// Find the closest file in a given direction based on actual positions
export const findClosestFileByPosition = (
  currentFile: FileWithPosition,
  allFiles: FileWithPosition[],
  direction: NavigationDirection
): FileWithPosition | null => {
  const candidates = allFiles.filter((fileWithPos) => {
    if (fileWithPos.file.id === currentFile.file.id) return false;

    switch (direction) {
      case 'up':
        return fileWithPos.y < currentFile.y;
      case 'down':
        return fileWithPos.y > currentFile.y;
      case 'left':
        return fileWithPos.x < currentFile.x;
      case 'right':
        return fileWithPos.x > currentFile.x;
      default:
        return false;
    }
  });

  if (candidates.length === 0) return null;

  // Find the closest file based on direction
  return candidates.reduce((closest, candidate) => {
    const currentDistance = calculateDistance(
      currentFile,
      candidate,
      direction
    );
    const closestDistance = calculateDistance(currentFile, closest, direction);
    return currentDistance < closestDistance ? candidate : closest;
  });
};

// Legacy function for non-icons view modes
export const findClosestFileByIndex = (
  currentIndex: number,
  files: FileItem[],
  direction: NavigationDirection
): number | null => {
  if (files.length === 0) return null;

  switch (direction) {
    case 'up':
    case 'left':
      return currentIndex > 0 ? currentIndex - 1 : null;
    case 'down':
    case 'right':
      return currentIndex < files.length - 1 ? currentIndex + 1 : null;
    default:
      return null;
  }
};
