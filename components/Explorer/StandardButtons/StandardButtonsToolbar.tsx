import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { navigateBack, navigateForward } from '@/lib/slices/navigationSlice';
import { findItemByPath, findItemById } from '@/lib/filesystem';
import ToolbarButton from './ToolbarButton';
import Divider from '../Common/Divider';

interface StandardButtonsToolbarProps {
  className?: string;
  windowId?: string;
  currentPath: string;
  onNavigate: (path: string, isNavigationAction?: boolean) => void;
}

const StandardButtonsToolbar: React.FC<StandardButtonsToolbarProps> = ({
  className,
  windowId,
  currentPath,
  onNavigate,
}) => {
  const dispatch = useDispatch();
  const navigation = useSelector((state: RootState) =>
    state.navigation.navigations.find((nav) => nav.windowId === windowId)
  );

  const canGoBack = navigation && navigation.currentIndex > 0;
  const canGoForward =
    navigation && navigation.currentIndex < navigation.history.length - 1;

  const handleBack = () => {
    if (canGoBack && windowId && navigation) {
      const newIndex = navigation.currentIndex - 1;
      const targetEntry = navigation.history[newIndex];
      // First update the path, then dispatch the navigation action
      onNavigate(targetEntry.path, true); // Pass true for isNavigationAction
      dispatch(navigateBack(windowId));
    }
  };

  const handleForward = () => {
    if (canGoForward && windowId && navigation) {
      const newIndex = navigation.currentIndex + 1;
      const targetEntry = navigation.history[newIndex];
      // First update the path, then dispatch the navigation action
      onNavigate(targetEntry.path, true); // Pass true for isNavigationAction
      dispatch(navigateForward(windowId));
    }
  };

  const handleUp = () => {
    if (currentPath === 'My Computer' || currentPath === 'Recycle Bin') {
      return; // Can't go up from these special locations
    }

    // Find parent path
    const currentItem = findItemByPath(currentPath);
    if (currentItem && currentItem.parentId) {
      // Find the parent item
      const parentItem = findItemById(currentItem.parentId);
      if (parentItem) {
        onNavigate(parentItem.path);
      }
    } else {
      // Default to going up one directory level
      const pathParts = currentPath.split('\\').filter(Boolean);
      if (pathParts.length > 1) {
        const parentPath = pathParts.slice(0, -1).join('\\');
        onNavigate(parentPath || 'C:\\');
      } else {
        onNavigate('My Computer');
      }
    }
  };

  return (
    <div
      className={`w-full flex items-center pl-0.5 flex-shrink-0 ${
        className || ''
      }`}
      style={{
        height: '45px',
        backgroundColor: '#efecdc',
        borderTop: '1px solid white',
        borderBottom: '1px solid #d8d2bd',
      }}
    >
      <ToolbarButton
        icon="/Back.png"
        text="Back"
        hasDropdown
        disabled={!canGoBack}
        onClick={handleBack}
      />
      <ToolbarButton
        icon="/Forward.png"
        hasDropdown
        disabled={!canGoForward}
        onClick={handleForward}
      />
      <ToolbarButton icon="/Up.png" onClick={handleUp} />
      <Divider />
      <ToolbarButton icon="/Search.png" text="Search" />
      <ToolbarButton icon="/Folder View.png" text="Folders" />
      <Divider />
      <ToolbarButton icon="/Icon View.png" hasDropdown noDropDownIcon />
    </div>
  );
};

export default StandardButtonsToolbar;
