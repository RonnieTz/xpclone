import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DesktopIcon } from '@/lib/slices/desktopSlice';
import { handleIconDoubleClick } from '../desktopHandlers';

export const useDesktopDoubleClick = (
  icons: DesktopIcon[],
  clearSelectionState: () => void
) => {
  const dispatch = useDispatch();

  const onIconDoubleClick = useCallback(
    (iconId: string, iconName: string) => {
      // Clear selection after opening
      clearSelectionState();

      // Handle the double click using the separated handler
      handleIconDoubleClick(iconId, iconName, icons, dispatch);
    },
    [icons, dispatch, clearSelectionState]
  );

  return { onIconDoubleClick };
};
