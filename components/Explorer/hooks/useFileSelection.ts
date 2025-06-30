import { useState, useCallback } from 'react';
import { FileItem } from '../FolderContent/types'; // Use existing FileItem interface

interface UseFileSelectionReturn {
  selectedFileIds: string[];
  lastSelectedIndex: number;
  handleFileSelect: (file: FileItem, event?: React.MouseEvent) => void;
  handleBackgroundClick: () => void;
  clearSelection: () => void;
}

export const useFileSelection = (files: FileItem[]): UseFileSelectionReturn => {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);

  const handleFileSelect = useCallback(
    (file: FileItem, event?: React.MouseEvent) => {
      const currentIndex = files.findIndex((f) => f.id === file.id);

      if (event?.ctrlKey) {
        // Ctrl+click: toggle selection of individual file
        setSelectedFileIds((prev) => {
          if (prev.includes(file.id)) {
            return prev.filter((id) => id !== file.id);
          } else {
            return [...prev, file.id];
          }
        });
        setLastSelectedIndex(currentIndex);
      } else if (event?.shiftKey && lastSelectedIndex !== -1) {
        // Shift+click: select range from last selected to current
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        const rangeIds = files.slice(start, end + 1).map((f) => f.id);
        setSelectedFileIds(rangeIds);
      } else {
        // Regular click: select only this file
        setSelectedFileIds([file.id]);
        setLastSelectedIndex(currentIndex);
      }
    },
    [files, lastSelectedIndex]
  );

  const handleBackgroundClick = useCallback(() => {
    setSelectedFileIds([]);
    setLastSelectedIndex(-1);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFileIds([]);
    setLastSelectedIndex(-1);
  }, []);

  return {
    selectedFileIds,
    lastSelectedIndex,
    handleFileSelect,
    handleBackgroundClick,
    clearSelection,
  };
};
