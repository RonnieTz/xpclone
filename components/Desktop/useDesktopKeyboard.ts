import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { selectIcon } from '@/lib/slices/desktopSlice';
import { findClosestIcon } from './desktopNavigation';
import { handleIconDoubleClick } from './desktopHandlers';

export const useDesktopKeyboard = (
  selectedIconId: string | null,
  icons: { id: string; name: string; x: number; y: number }[]
) => {
  const dispatch = useDispatch();

  const handleArrowNavigation = useCallback(
    (direction: string) => {
      if (icons.length === 0) return;

      // If no icon is selected, select the first one
      if (!selectedIconId) {
        dispatch(selectIcon(icons[0].id));
        return;
      }

      const currentIcon = icons.find((icon) => icon.id === selectedIconId);
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

      if (targetIcon) {
        dispatch(selectIcon(targetIcon.id));
      }
    },
    [icons, selectedIconId, dispatch]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        handleArrowNavigation(e.key);
      }
    };

    // Add event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIconId, icons, dispatch, handleArrowNavigation]);
};
