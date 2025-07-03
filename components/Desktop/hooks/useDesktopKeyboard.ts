import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { selectIcon, selectMultipleIcons } from '@/lib/slices/desktopSlice';
import { findClosestIcon } from '../utils/desktopNavigation';
import { handleIconDoubleClick } from '../utils/desktopHandlers';

export const useDesktopKeyboard = (
  selectedIconId: string | null,
  icons: { id: string; name: string; x: number; y: number }[],
  anchorIndex: number,
  setAnchorIndex: (index: number) => void,
  getVisuallyOrderedIcons: () => typeof icons
) => {
  const dispatch = useDispatch();

  // Get all selected icons and current selection state
  const selectedIconIds = useSelector(
    (state: RootState) => state.desktop.selectedIconIds
  );

  // Check if any Explorer windows are currently focused
  const hasActiveExplorerWindow = useSelector((state: RootState) => {
    const activeWindow = state.windows.windows.find((w) => w.isActive);
    return (
      activeWindow &&
      (activeWindow.content.includes('Folder:') ||
        activeWindow.content.includes('My Computer') ||
        activeWindow.content.includes('Recycle Bin'))
    );
  });

  const handleArrowNavigation = useCallback(
    (direction: string, withShift: boolean = false) => {
      if (icons.length === 0) return;

      // If no icon is selected, select the first one
      if (!selectedIconId) {
        dispatch(selectIcon(icons[0].id));
        const visualIcons = getVisuallyOrderedIcons();
        const firstIndex = visualIcons.findIndex(
          (icon) => icon.id === icons[0].id
        );
        setAnchorIndex(firstIndex);
        return;
      }

      // For shift operations, we need to find the current focus icon
      // For regular operations, we use the selectedIconId
      let currentIcon;
      if (withShift && selectedIconIds.length > 1) {
        // In range selection, determine which end of the selection to extend from
        const visualIcons = getVisuallyOrderedIcons();

        // Get the indices of the first and last selected icons in visual order
        const firstSelectedIndex = Math.min(
          ...selectedIconIds.map((id) =>
            visualIcons.findIndex((icon) => icon.id === id)
          )
        );
        const lastSelectedIndex = Math.max(
          ...selectedIconIds.map((id) =>
            visualIcons.findIndex((icon) => icon.id === id)
          )
        );

        // For forward directions (down/right), extend from the last selected
        // For backward directions (up/left), extend from the first selected
        if (direction === 'ArrowDown' || direction === 'ArrowRight') {
          const lastSelectedId = visualIcons[lastSelectedIndex]?.id;
          currentIcon = icons.find((icon) => icon.id === lastSelectedId);
        } else {
          const firstSelectedId = visualIcons[firstSelectedIndex]?.id;
          currentIcon = icons.find((icon) => icon.id === firstSelectedId);
        }
      } else {
        currentIcon = icons.find((icon) => icon.id === selectedIconId);
      }

      if (!currentIcon) return;

      let targetIcon: (typeof icons)[0] | null = null;

      switch (direction) {
        case 'ArrowUp':
          targetIcon = findClosestIcon(currentIcon, icons, 'up');
          break;
        case 'ArrowDown':
          targetIcon = findClosestIcon(currentIcon, icons, 'down');
          break;
        case 'ArrowLeft':
          targetIcon = findClosestIcon(currentIcon, icons, 'left');
          break;
        case 'ArrowRight':
          targetIcon = findClosestIcon(currentIcon, icons, 'right');
          break;
      }

      if (!targetIcon) return;

      if (withShift && anchorIndex !== -1) {
        // Shift+Arrow: Range selection from anchor to target (same as mouse selection)
        const visualIcons = getVisuallyOrderedIcons();
        const targetIndex = visualIcons.findIndex(
          (icon) => icon.id === targetIcon.id
        );

        if (targetIndex !== -1) {
          const start = Math.min(anchorIndex, targetIndex);
          const end = Math.max(anchorIndex, targetIndex);
          const rangeIds = visualIcons
            .slice(start, end + 1)
            .map((icon) => icon.id);

          dispatch(selectMultipleIcons(rangeIds));
        }
      } else {
        // Regular arrow: Single select and set new anchor
        dispatch(selectIcon(targetIcon.id));
        const visualIcons = getVisuallyOrderedIcons();
        const newAnchorIndex = visualIcons.findIndex(
          (icon) => icon.id === targetIcon.id
        );
        setAnchorIndex(newAnchorIndex);
      }
    },
    [
      icons,
      selectedIconId,
      selectedIconIds,
      anchorIndex,
      dispatch,
      setAnchorIndex,
      getVisuallyOrderedIcons,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events if an Explorer window is focused
      if (hasActiveExplorerWindow) return;

      if (e.key === 'Enter' && selectedIconId) {
        const selectedIcon = icons.find((icon) => icon.id === selectedIconId);
        if (selectedIcon) {
          handleIconDoubleClick(
            selectedIconId,
            selectedIcon.name,
            icons,
            dispatch
          );
        }
        return;
      }

      // Handle arrow key navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        handleArrowNavigation(e.key, e.shiftKey);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedIconId,
    selectedIconIds,
    icons,
    dispatch,
    handleArrowNavigation,
    hasActiveExplorerWindow,
  ]);
};
