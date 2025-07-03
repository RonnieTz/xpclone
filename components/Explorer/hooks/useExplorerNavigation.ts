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
      // Force a new array reference to ensure React detects the change
      setFiles([...fileItems]);
    } else {
      setFiles([]);
    }
  }, []);

  // Initialize navigation when component mounts - only once per window
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
  }, [windowId, dispatch]); // Remove currentPath dependency to prevent re-initialization

  // Load files when path changes - add dependency array to ensure effect runs
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
      // Validate that the target path exists and is a folder
      const targetItem = findItemByPath(newPath);
      if (!targetItem) {
        console.error('Target path does not exist:', newPath);
        return;
      }

      if (!('children' in targetItem)) {
        console.error('Target path is not a folder:', newPath);
        return;
      }

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

      // Force state update by ensuring React sees this as a new value
      setCurrentPath(newPath);

      // Also explicitly load files after path change to ensure they update
      setTimeout(() => {
        loadFilesForPath(newPath);
      }, 0);
    },
    [windowId, dispatch, loadFilesForPath]
  );

  return {
    currentPath,
    files,
    handlePathChange,
    loadFilesForPath,
  };
};
