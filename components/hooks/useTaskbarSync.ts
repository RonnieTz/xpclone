import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { syncTaskbarWithWindows } from '@/lib/slices/taskbarSlice';
import { WindowState } from '@/lib/slices/windowsSlice';

export const useTaskbarSync = () => {
  const dispatch = useDispatch();
  const { windows } = useSelector((state: RootState) => state.windows);

  // Sync taskbar items with windows, excluding modal windows
  useEffect(() => {
    const taskbarItems = windows
      .filter((window: WindowState) => !window.isModal) // Exclude modal windows
      .map((window: WindowState) => ({
        id: `taskbar-${window.id}`,
        title: window.title,
        icon: window.icon,
        isActive: window.isActive,
        isMinimized: window.isMinimized,
        windowId: window.id,
      }));

    dispatch(syncTaskbarWithWindows(taskbarItems));
  }, [windows, dispatch]);
};
