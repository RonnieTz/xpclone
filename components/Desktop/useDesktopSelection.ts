import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  selectIcon,
  selectMultipleIcons,
  toggleIconSelection,
  clearSelection,
} from '@/lib/slices/desktopSlice';

export const useDesktopSelection = (getVisuallyOrderedIcons: () => any[]) => {
  const dispatch = useDispatch();
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);
  const [anchorIndex, setAnchorIndex] = useState<number>(-1);

  const handleDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        dispatch(clearSelection());
        setLastSelectedIndex(-1);
        setAnchorIndex(-1);
      }
    },
    [dispatch]
  );

  const handleIconSelect = useCallback(
    (iconId: string, event?: React.MouseEvent) => {
      // Use visual ordering for consistency with keyboard navigation
      const visualIcons = getVisuallyOrderedIcons();
      const iconIndex = visualIcons.findIndex((icon) => icon.id === iconId);

      if (event?.ctrlKey) {
        // Ctrl+click: toggle selection of individual icon
        dispatch(toggleIconSelection(iconId));
        setLastSelectedIndex(iconIndex);
        setAnchorIndex(iconIndex);
      } else if (event?.shiftKey && anchorIndex !== -1) {
        // Shift+click: select range from anchor to current using visual ordering
        const start = Math.min(anchorIndex, iconIndex);
        const end = Math.max(anchorIndex, iconIndex);
        const rangeIds = visualIcons
          .slice(start, end + 1)
          .map((icon) => icon.id);
        dispatch(selectMultipleIcons(rangeIds));
        setLastSelectedIndex(iconIndex); // Update focus but keep anchor
      } else {
        // Regular click: select only this icon and set as new anchor
        dispatch(selectIcon(iconId));
        setLastSelectedIndex(iconIndex);
        setAnchorIndex(iconIndex);
      }
    },
    [dispatch, anchorIndex, getVisuallyOrderedIcons]
  );

  const clearSelectionState = useCallback(() => {
    dispatch(clearSelection());
    setLastSelectedIndex(-1);
    setAnchorIndex(-1);
  }, [dispatch]);

  return {
    lastSelectedIndex,
    anchorIndex,
    setAnchorIndex,
    handleDesktopClick,
    handleIconSelect,
    clearSelectionState,
  };
};
