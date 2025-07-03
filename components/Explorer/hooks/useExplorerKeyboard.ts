import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FileItem } from '../FolderContent/types';
import { NavigationDirection, UseExplorerKeyboardProps } from './types';
import { getFilesWithPositions } from './positionUtils';
import {
  findClosestFileByPosition,
  findClosestFileByIndex,
} from './navigationUtils';

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
  // Get the current focused window to determine if we should handle keyboard events
  const currentWindow = useSelector((state: RootState) =>
    windowId ? state.windows.windows.find((w) => w.id === windowId) : null
  );

  const handleArrowNavigation = useCallback(
    (direction: NavigationDirection, withShift: boolean = false) => {
      if (files.length === 0) return;

      let targetFile: FileItem;

      // If no file is selected, select the first one
      if (selectedFileIds.length === 0) {
        targetFile = files[0];
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
              direction
            );
            if (newTargetIndex === null) return; // No valid target found
            targetFile = files[newTargetIndex];
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
