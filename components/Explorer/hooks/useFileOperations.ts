import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { findItemByPath } from '@/lib/filesystem';
import { setItemPosition } from '@/lib/slices/folderPositionsSlice';
import { handleFileSystemItemOpen } from '../../Desktop/desktopHandlers';
import { FileItem } from '../FolderContent/types'; // Use existing FileItem interface

interface UseFileOperationsProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  clearSelection: () => void;
}

interface UseFileOperationsReturn {
  handleFileDoubleClick: (file: FileItem) => void;
  handleFileMove: (fileId: string, x: number, y: number) => void;
}

export const useFileOperations = ({
  currentPath,
  onPathChange,
  clearSelection,
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
        })
      );
    },
    [dispatch, currentPath]
  );

  return {
    handleFileDoubleClick,
    handleFileMove,
  };
};
