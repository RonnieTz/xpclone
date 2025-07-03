import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { findItemByPath } from '@/lib/filesystem';
import { initializeNavigation, navigateTo } from '@/lib/slices/navigationSlice';
import { updateWindowTitleAndContent } from '@/lib/slices/windowsSlice';
import { FileItem } from '../FolderContent/types'; // Use existing FileItem interface
import {
  getWindowTitle,
  getWindowContent,
  convertToFileItem,
} from '../explorerUtils';

interface UseExplorerNavigationProps {
  initialPath?: string; // Make optional to handle undefined
  windowId?: string;
}

interface UseExplorerNavigationReturn {
  currentPath: string;
  files: FileItem[];
  handlePathChange: (newPath: string, isNavigationAction?: boolean) => void;
  loadFilesForPath: (targetPath: string) => void;
}

export const useExplorerNavigation = ({
  initialPath,
  windowId,
}: UseExplorerNavigationProps): UseExplorerNavigationReturn => {
  const dispatch = useDispatch();
  const [currentPath, setCurrentPath] = useState(initialPath || 'C:\\');
  const [files, setFiles] = useState<FileItem[]>([]);

  // Load files for the current path
  const loadFilesForPath = useCallback((targetPath: string) => {
    const currentItem = findItemByPath(targetPath);
    if (currentItem && 'children' in currentItem) {
      const fileItems = currentItem.children.map(convertToFileItem);
      setFiles(fileItems);
    } else {
      setFiles([]);
    }
  }, []);

  // Initialize navigation when component mounts
  useEffect(() => {
    if (windowId) {
      const title = getWindowTitle(currentPath);
      dispatch(
        initializeNavigation({
          windowId,
          path: currentPath,
          title,
        })
      );
    }
  }, [windowId, currentPath, dispatch]);

  // Load files when path changes
  useEffect(() => {
    loadFilesForPath(currentPath);
  }, [currentPath, loadFilesForPath]);

  // Handle navigation effects when path changes
  useEffect(() => {
    if (currentPath) {
      // Add any additional effects needed when currentPath changes
    }
  }, [currentPath]);

  const handlePathChange = useCallback(
    (newPath: string, isNavigationAction?: boolean) => {
      // Update window title and content
      if (windowId) {
        const title = getWindowTitle(newPath);
        const content = getWindowContent(newPath);

        dispatch(
          updateWindowTitleAndContent({
            id: windowId,
            title,
            content,
          })
        );

        // Only add to navigation history if this is NOT a back/forward navigation action
        if (!isNavigationAction) {
          dispatch(
            navigateTo({
              windowId,
              path: newPath,
              title,
            })
          );
        }
      }

      setCurrentPath(newPath);
    },
    [windowId, dispatch]
  );

  return {
    currentPath,
    files,
    handlePathChange,
    loadFilesForPath,
  };
};
