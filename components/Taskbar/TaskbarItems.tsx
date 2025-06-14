'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import {
  focusWindow,
  minimizeWindow,
  restoreWindow,
  setTaskbarAnimationTarget,
} from '@/lib/slices/windowsSlice';
import { useTaskbarPosition } from '../Window/useTaskbarPosition';
import TaskbarItem from './TaskbarItem';

const TaskbarItems: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.taskbar);
  const { windows } = useSelector((state: RootState) => state.windows);
  const { getTaskbarItemPosition } = useTaskbarPosition();

  const handleTaskbarItemClick = (windowId: string) => {
    const item = items.find((item) => item.windowId === windowId);
    const window = windows.find((w) => w.id === windowId);

    // If the window is active and not minimized, minimize it
    if (item && item.isActive && !item.isMinimized) {
      // Get taskbar position for minimize animation
      const taskbarPosition = getTaskbarItemPosition(windowId);
      if (taskbarPosition) {
        dispatch(
          setTaskbarAnimationTarget({
            id: windowId,
            target: taskbarPosition,
          })
        );
      }
      dispatch(minimizeWindow(windowId));
    } else if (item && item.isMinimized && window) {
      // If minimized, restore with animation from taskbar
      const taskbarPosition = getTaskbarItemPosition(windowId);
      if (taskbarPosition) {
        dispatch(
          setTaskbarAnimationTarget({
            id: windowId,
            target: taskbarPosition,
          })
        );
      }
      dispatch(restoreWindow(windowId));
      dispatch(focusWindow(windowId));
    } else {
      // Otherwise, just focus the window
      dispatch(focusWindow(windowId));
    }
  };

  return (
    <div className="flex-1 flex items-center ml-2 space-x-1">
      {items.map((item) => (
        <TaskbarItem
          key={item.id}
          item={item}
          onClick={handleTaskbarItemClick}
        />
      ))}
    </div>
  );
};

export default TaskbarItems;
