import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { WindowState } from '@/lib/slices/types/windowTypes';

interface UseExplorerEffectsProps {
  windowId?: string;
  currentPath: string;
  selectedFileIds: string[];
  loadFilesForPath: (path: string) => void;
  clearSelection: () => void;
}

export const useExplorerEffects = ({
  windowId,
  currentPath,
  selectedFileIds,
  loadFilesForPath,
  clearSelection,
}: UseExplorerEffectsProps) => {
  // Get the current window to watch for focus changes
  const currentWindow = useSelector((state: RootState) =>
    windowId
      ? state.windows.windows.find((w: WindowState) => w.id === windowId)
      : null
  );

  // Watch for refresh counter changes to reload files
  useEffect(() => {
    if (currentWindow?.refreshCounter) {
      loadFilesForPath(currentPath);
    }
  }, [currentWindow?.refreshCounter, loadFilesForPath, currentPath]);

  // Clear file selections when window loses focus
  useEffect(() => {
    if (
      currentWindow &&
      !currentWindow.isActive &&
      selectedFileIds.length > 0
    ) {
      clearSelection();
    }
  }, [currentWindow, selectedFileIds.length, clearSelection]);

  // Clear selection when changing paths
  useEffect(() => {
    clearSelection();
  }, [currentPath, clearSelection]);

  // Handle any effects when this window becomes active
  useEffect(() => {
    if (currentWindow && currentWindow.isActive) {
      // Handle any effects when this window becomes active
    }
  }, [currentWindow, currentWindow?.isActive]);
};
