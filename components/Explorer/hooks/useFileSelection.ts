import { useState, useCallback } from 'react';
import { FileItem } from '../FolderContent/types'; // Use existing FileItem interface

interface UseFileSelectionReturn {
  selectedFileIds: string[];
  lastSelectedIndex: number;
  handleFileSelect: (file: FileItem, event?: React.MouseEvent) => void;
  handleBackgroundClick: () => void;
  clearSelection: () => void;
  selectAll: () => void; // Add selectAll function
}

export const useFileSelection = (files: FileItem[]): UseFileSelectionReturn => {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);
  const [anchorIndex, setAnchorIndex] = useState<number>(-1); // Add anchor tracking

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
        setAnchorIndex(currentIndex); // Update anchor for Ctrl+click
      } else if (event?.shiftKey && anchorIndex !== -1) {
        // Shift+click/arrow: select range from anchor to current
        const start = Math.min(anchorIndex, currentIndex);
        const end = Math.max(anchorIndex, currentIndex);
        const rangeIds = files.slice(start, end + 1).map((f) => f.id);
        setSelectedFileIds(rangeIds);
        setLastSelectedIndex(currentIndex); // Update focus but keep anchor
      } else {
        // Regular click/arrow: select only this file and set as new anchor
        setSelectedFileIds([file.id]);
        setLastSelectedIndex(currentIndex);
        setAnchorIndex(currentIndex); // Set new anchor point
      }
    },
    [files, anchorIndex] // Changed dependency from lastSelectedIndex to anchorIndex
  );

  const handleBackgroundClick = useCallback(() => {
    setSelectedFileIds([]);
    setLastSelectedIndex(-1);
    setAnchorIndex(-1);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFileIds([]);
    setLastSelectedIndex(-1);
    setAnchorIndex(-1);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedFileIds(files.map((f) => f.id));
    setLastSelectedIndex(files.length > 0 ? files.length - 1 : -1);
    setAnchorIndex(0); // Set anchor to first file when selecting all
  }, [files]);

  return {
    selectedFileIds,
    lastSelectedIndex,
    handleFileSelect,
    handleBackgroundClick,
    clearSelection,
    selectAll,
  };
};
