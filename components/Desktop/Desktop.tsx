'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  selectIcon,
  selectMultipleIcons,
  toggleIconSelection,
  clearSelection,
  moveIcon,
} from '@/lib/slices/desktopSlice';
import DesktopIcon from './DesktopIcon';
import { handleIconDoubleClick } from './desktopHandlers';
import { useDesktopKeyboard } from './useDesktopKeyboard';

const Desktop: React.FC = () => {
  const dispatch = useDispatch();
  const { icons, selectedIconIds } = useSelector(
    (state: RootState) => state.desktop
  );
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);

  // Use the custom hook for keyboard navigation
  useDesktopKeyboard(selectedIconIds[0] || null, icons);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(clearSelection());
      setLastSelectedIndex(-1);
    }
  };

  const handleIconSelect = (iconId: string, event?: React.MouseEvent) => {
    const iconIndex = icons.findIndex((icon) => icon.id === iconId);

    if (event?.ctrlKey) {
      // Ctrl+click: toggle selection of individual icon
      dispatch(toggleIconSelection(iconId));
      setLastSelectedIndex(iconIndex);
    } else if (event?.shiftKey && lastSelectedIndex !== -1) {
      // Shift+click: select range from last selected to current
      const start = Math.min(lastSelectedIndex, iconIndex);
      const end = Math.max(lastSelectedIndex, iconIndex);
      const rangeIds = icons.slice(start, end + 1).map((icon) => icon.id);

      // Combine with existing selection if Ctrl is also held
      if (event?.ctrlKey) {
        const newSelection = [...new Set([...selectedIconIds, ...rangeIds])];
        dispatch(selectMultipleIcons(newSelection));
      } else {
        dispatch(selectMultipleIcons(rangeIds));
      }
    } else {
      // Regular click: select only this icon
      dispatch(selectIcon(iconId));
      setLastSelectedIndex(iconIndex);
    }
  };

  const onIconDoubleClick = (iconId: string, iconName: string) => {
    // Clear selection after opening
    dispatch(clearSelection());
    setLastSelectedIndex(-1);

    // Handle the double click using the separated handler
    handleIconDoubleClick(iconId, iconName, icons, dispatch);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none"
      onClick={handleDesktopClick}
      style={{
        backgroundImage: 'url(/wallpaper.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'transparent',
      }}
    >
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          isSelected={selectedIconIds.includes(icon.id)}
          onSelect={(event) => handleIconSelect(icon.id, event)}
          onDoubleClick={() => onIconDoubleClick(icon.id, icon.name)}
          onMove={(x, y) => dispatch(moveIcon({ id: icon.id, x, y }))}
        />
      ))}
    </div>
  );
};

export default Desktop;
