import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { findItemByPath } from '@/lib/filesystem';
import {
  setItemPosition,
  setMultipleItemPositions,
} from '@/lib/slices/folderPositionsSlice';
import { handleFileSystemItemOpen } from '../../Desktop/utils/desktopHandlers';
import { FileItem } from '../FolderContent/types'; // Use existing FileItem interface

interface UseFileOperationsProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  clearSelection: () => void;
  windowId?: string; // Add windowId
  inheritedPositions?: Record<string, { x: number; y: number }>; // Add inherited positions
}

interface UseFileOperationsReturn {
  handleFileDoubleClick: (file: FileItem) => void;
  handleFileMove: (fileId: string, x: number, y: number) => void;
  copyInheritedPositions: () => void; // Add function to copy inherited positions
}

export const useFileOperations = ({
  currentPath,
  onPathChange,
  clearSelection,
  windowId, // Add windowId parameter
  inheritedPositions, // Add inherited positions
}: UseFileOperationsProps): UseFileOperationsReturn => {
  const dispatch = useDispatch();

  const handleFileDoubleClick = useCallback(
    (file: FileItem) => {
      // Clear selection when opening
      clearSelection();

      if (file.type === 'folder') {
        onPathChange(file.path);
      } else {
        // Open file in appropriate application window
        const fileSystemItem = findItemByPath(file.path);
        if (fileSystemItem) {
          handleFileSystemItemOpen(fileSystemItem, file.name, dispatch);
        }
      }
    },
    [onPathChange, clearSelection, dispatch]
  );

  // Handle file position updates from drag operations - save to Redux for persistence
  const handleFileMove = useCallback(
    (fileId: string, x: number, y: number) => {
      // Save to Redux for persistence across window closures
      dispatch(
        setItemPosition({
          folderPath: currentPath,
          fileId,
          x,
          y,
          windowId, // Pass windowId for window-specific positioning
        })
      );
    },
    [dispatch, currentPath, windowId] // Remove inheritedPositions as it's not used in this function
  );

  // Copy inherited positions to current window's storage
  const copyInheritedPositions = useCallback(() => {
    if (
      windowId &&
      inheritedPositions &&
      Object.keys(inheritedPositions).length > 0
    ) {
      dispatch(
        setMultipleItemPositions({
          folderPath: currentPath,
          positions: inheritedPositions,
          windowId,
        })
      );
    }
  }, [dispatch, currentPath, windowId, inheritedPositions]); // Add inheritedPositions back as it's used in the function

  return {
    handleFileDoubleClick,
    handleFileMove,
    copyInheritedPositions,
  };
};
