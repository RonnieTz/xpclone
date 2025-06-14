import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useCallback } from 'react';

export const useTaskbarPosition = () => {
  const taskbarItems = useSelector((state: RootState) => state.taskbar.items);

  const getTaskbarItemPosition = useCallback(
    (windowId: string) => {
      const itemIndex = taskbarItems.findIndex(
        (item) => item.windowId === windowId
      );
      if (itemIndex === -1) {
        return null;
      }

      // Calculate taskbar item position
      // Taskbar starts after start button (130px) + margin (8px)
      // Each item is 150px wide + 4px margin
      const startOffset = 138; // Start button width + margin
      const itemWidth = 150;
      const itemSpacing = 4;
      const itemX = startOffset + itemIndex * (itemWidth + itemSpacing);

      // Taskbar is at bottom of screen (40px height)
      const taskbarY = window.innerHeight - 40;
      const taskbarItemY = taskbarY + 4; // 4px margin from top of taskbar
      const taskbarItemHeight = 32;

      return {
        x: itemX,
        y: taskbarItemY,
        width: itemWidth,
        height: taskbarItemHeight,
      };
    },
    [taskbarItems]
  );

  return { getTaskbarItemPosition };
};
