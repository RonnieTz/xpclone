import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

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
    windowId ? state.windows.windows.find((w) => w.id === windowId) : null
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
  }, [currentWindow?.isActive, selectedFileIds.length, clearSelection]);

  // Clear selection when changing paths
  useEffect(() => {
    clearSelection();
  }, [currentPath, clearSelection]);
};
