import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FileItem } from '../FolderContent/types';

export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

interface UseExplorerKeyboardProps {
  files: FileItem[];
  selectedFileIds: string[];
  lastSelectedIndex: number;
  viewMode: string;
  windowId?: string;
  itemPositions?: Record<string, { x: number; y: number }>; // Add item positions
  onFileSelect: (file: FileItem, event?: React.MouseEvent) => void;
  onFileDoubleClick: (file: FileItem) => void;
  onSelectAll: () => void;
}

// Interface for file with position data
interface FileWithPosition {
  file: FileItem;
  index: number;
  x: number;
  y: number;
}

// Calculate default grid position for a file based on view mode and index
const getDefaultGridPosition = (index: number, viewMode: string) => {
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
const getFilesWithPositions = (
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
const calculateDistance = (
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

// Find the closest file in a given direction based on actual positions
const findClosestFileByPosition = (
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
const findClosestFileByIndex = (
  currentIndex: number,
  files: FileItem[],
  direction: NavigationDirection,
  viewMode: string
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

export const useExplorerKeyboard = ({
  files,
  selectedFileIds,
  lastSelectedIndex,
  viewMode,
  windowId,
  itemPositions,
  onFileSelect,
  onFileDoubleClick,
  onSelectAll,
}: UseExplorerKeyboardProps) => {
  const dispatch = useDispatch();

  // Get the current focused window to determine if we should handle keyboard events
  const currentWindow = useSelector((state: RootState) =>
    windowId ? state.windows.windows.find((w) => w.id === windowId) : null
  );

  const handleArrowNavigation = useCallback(
    (direction: NavigationDirection, withShift: boolean = false) => {
      if (files.length === 0) return;

      let targetFile: FileItem;
      let targetIndex: number;

      // If no file is selected, select the first one
      if (selectedFileIds.length === 0) {
        targetFile = files[0];
        targetIndex = 0;
      } else {
        // Use the last selected index as the reference point
        const currentIndex =
          lastSelectedIndex >= 0
            ? lastSelectedIndex
            : files.findIndex(
                (f) => f.id === selectedFileIds[selectedFileIds.length - 1]
              );

        if (currentIndex === -1) {
          targetFile = files[0];
          targetIndex = 0;
        } else {
          const currentFile = files[currentIndex];

          if (viewMode === 'icons' && itemPositions) {
            // Use position-based navigation for icons view
            const filesWithPositions = getFilesWithPositions(
              files,
              itemPositions,
              viewMode
            );
            const currentFileWithPos = filesWithPositions.find(
              (f) => f.file.id === currentFile.id
            );

            if (currentFileWithPos) {
              const targetFileWithPos = findClosestFileByPosition(
                currentFileWithPos,
                filesWithPositions,
                direction
              );
              if (targetFileWithPos) {
                targetFile = targetFileWithPos.file;
                targetIndex = targetFileWithPos.index;
              } else {
                return; // No valid target found
              }
            } else {
              return; // Current file not found
            }
          } else {
            // Use index-based navigation for other view modes
            const newTargetIndex = findClosestFileByIndex(
              currentIndex,
              files,
              direction,
              viewMode
            );
            if (newTargetIndex === null) return; // No valid target found
            targetFile = files[newTargetIndex];
            targetIndex = newTargetIndex;
          }
        }
      }

      if (!targetFile) return;

      // Create a mock event object for the selection handler
      const mockEvent = {
        shiftKey: withShift,
        ctrlKey: false,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.MouseEvent;

      // Use the existing selection handler which already has proper Shift logic
      onFileSelect(targetFile, mockEvent);
    },
    [
      files,
      selectedFileIds,
      lastSelectedIndex,
      viewMode,
      itemPositions,
      onFileSelect,
    ]
  );

  const handleSelectAll = useCallback(() => {
    onSelectAll();
  }, [onSelectAll]);

  const handleEnterKey = useCallback(() => {
    if (selectedFileIds.length === 1) {
      const selectedFile = files.find((f) => f.id === selectedFileIds[0]);
      if (selectedFile) {
        onFileDoubleClick(selectedFile);
      }
    }
  }, [selectedFileIds, files, onFileDoubleClick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events if this window is focused
      if (!currentWindow?.isActive) return;

      // Handle Ctrl+A for Select All
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
        return;
      }

      // Handle Enter key to open selected file
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEnterKey();
        return;
      }

      // Handle arrow key navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();

        const direction = e.key
          .replace('Arrow', '')
          .toLowerCase() as NavigationDirection;
        const withShift = e.shiftKey;

        handleArrowNavigation(direction, withShift);
      }
    };

    // Add event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    currentWindow?.isActive,
    handleArrowNavigation,
    handleSelectAll,
    handleEnterKey,
  ]);
};
