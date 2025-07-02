import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { moveIcon } from '@/lib/slices/desktopSlice';
import { getVisuallyOrderedIcons } from '../utils/desktopUtils';
import { useDesktopSelection } from './useDesktopSelection';
import { useDesktopDoubleClick } from './useDesktopDoubleClick';
import { useDesktopKeyboard } from './useDesktopKeyboard';

export const useDesktop = () => {
  const dispatch = useDispatch();
  const { icons, selectedIconIds } = useSelector(
    (state: RootState) => state.desktop
  );

  // Create consistent visual ordering function
  const getOrderedIcons = () => getVisuallyOrderedIcons(icons);

  // Use selection hook
  const {
    lastSelectedIndex,
    anchorIndex,
    setAnchorIndex,
    handleDesktopClick,
    handleIconSelect,
    clearSelectionState,
  } = useDesktopSelection(getOrderedIcons);

  // Use double-click hook
  const { onIconDoubleClick } = useDesktopDoubleClick(
    icons,
    clearSelectionState
  );

  // Use keyboard navigation hook
  useDesktopKeyboard(
    selectedIconIds[0] || null,
    icons,
    anchorIndex,
    setAnchorIndex,
    getOrderedIcons
  );

  // Handle icon movement
  const handleIconMove = (id: string, x: number, y: number) => {
    dispatch(moveIcon({ id, x, y }));
  };

  return {
    icons,
    selectedIconIds,
    handleDesktopClick,
    handleIconSelect,
    onIconDoubleClick,
    handleIconMove,
  };
};
