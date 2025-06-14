'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { selectIcon, moveIcon } from '@/lib/slices/desktopSlice';
import { openWindow } from '@/lib/slices/windowsSlice';
import { FileSystemItem, findItemById } from '@/lib/filesystem';
import DesktopIcon from './DesktopIcon';

const Desktop: React.FC = () => {
  const dispatch = useDispatch();
  const { icons, selectedIconId } = useSelector(
    (state: RootState) => state.desktop
  );

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(selectIcon(null));
    }
  };

  const handleIconDoubleClick = (iconId: string, iconName: string) => {
    const icon = icons.find((i) => i.id === iconId);
    const fileSystemItem = icon?.fileSystemItem;

    if (!fileSystemItem) return;

    // Check if this is a folder-like item that should open Explorer
    const isFolderLike = (item: FileSystemItem, name: string): boolean => {
      // Always show Explorer for actual folders
      if (item.type === 'folder') return true;

      // Check for folder-like shortcuts by name
      const folderLikeNames = [
        'My Documents',
        'My Pictures',
        'My Music',
        'My Videos',
        'My Computer',
        'Recycle Bin',
        'Desktop',
        'Documents',
        'Pictures',
        'Music',
        'Videos',
      ];

      if (
        folderLikeNames.some((folderName) =>
          name.toLowerCase().includes(folderName.toLowerCase())
        )
      ) {
        return true;
      }

      // Check for shortcuts that point to folder paths
      if (item.type === 'shortcut') {
        const shortcut = item as { targetPath: string };
        const folderLikePaths = [
          'My Computer',
          'Recycle Bin',
          'Documents',
          'Pictures',
          'Music',
        ];
        return folderLikePaths.some((path) =>
          shortcut.targetPath.includes(path)
        );
      }

      return false;
    };

    // If it's a folder-like item, handle it as Explorer content
    if (isFolderLike(fileSystemItem, iconName)) {
      handleFolderLikeItemOpen(fileSystemItem, iconName);
      return;
    }

    // Handle other types normally
    switch (fileSystemItem.type) {
      case 'shortcut':
        // For non-folder shortcuts, resolve the target
        const shortcut = fileSystemItem as {
          targetId: string;
          targetPath: string;
        };
        const targetItem = findItemById(shortcut.targetId);

        if (targetItem) {
          handleFileSystemItemOpen(targetItem, iconName);
        } else {
          // If target not found, try to handle by targetPath
          handleSpecialShortcut(shortcut.targetPath, iconName);
        }
        break;

      case 'file':
        handleFileSystemItemOpen(fileSystemItem, iconName);
        break;

      case 'folder':
        handleFileSystemItemOpen(fileSystemItem, iconName);
        break;

      case 'program':
        handleFileSystemItemOpen(fileSystemItem, iconName);
        break;

      default:
        handleFileSystemItemOpen(fileSystemItem, iconName);
    }
  };

  const handleFolderLikeItemOpen = (
    item: FileSystemItem,
    displayName: string
  ) => {
    let windowContent = '';
    let iconId: string;

    // Determine the path and type for Explorer
    if (item.type === 'folder') {
      windowContent = `Folder: ${item.path}`;
      iconId = item.icon || 'folder';
    } else if (item.type === 'shortcut') {
      const shortcut = item as { targetPath: string };
      // Set appropriate content for Explorer detection
      if (displayName.toLowerCase().includes('my computer')) {
        windowContent = 'My Computer - System drives and devices';
        iconId = 'computer';
      } else if (displayName.toLowerCase().includes('recycle bin')) {
        windowContent = 'Recycle Bin - Deleted items';
        iconId = 'recycle';
      } else {
        windowContent = `Folder: ${shortcut.targetPath}`;
        iconId = item.icon || 'folder';
      }
    } else {
      // Fallback
      windowContent = `Folder: ${displayName}`;
      iconId = item.icon || 'folder';
    }

    dispatch(
      openWindow({
        title: displayName,
        content: windowContent,
        icon: iconId,
        x: 100 + Math.random() * 100,
        y: 100 + Math.random() * 100,
        width: 700,
        height: 500,
        isMinimized: false,
        isMaximized: false,
        isResizable: true,
      })
    );
  };

  const handleFileSystemItemOpen = (
    item: FileSystemItem,
    displayName: string
  ) => {
    let windowContent = '';
    let iconId = item.icon || 'file'; // eslint-disable-line prefer-const

    switch (item.type) {
      case 'file':
        const fileItem = item as { content?: string; name: string };
        windowContent = fileItem.content || `File: ${item.name}`;
        break;

      case 'folder':
        windowContent = `Folder: ${item.path}`;
        break;

      case 'program':
        windowContent = `Program: ${item.name}`;
        break;

      default:
        windowContent = `Item: ${item.name}`;
    }

    dispatch(
      openWindow({
        title: displayName,
        content: windowContent,
        icon: iconId,
        x: 100 + Math.random() * 100, // Slight random offset
        y: 100 + Math.random() * 100,
        width: item.type === 'folder' ? 700 : 600,
        height: item.type === 'folder' ? 500 : 400,
        isMinimized: false,
        isMaximized: false,
        isResizable: true,
      })
    );
  };

  const handleSpecialShortcut = (targetPath: string, displayName: string) => {
    // Handle special system shortcuts that don't have filesystem representations
    let windowContent = '';
    let iconId = 'file'; // default

    switch (targetPath) {
      case 'My Computer':
        windowContent = 'My Computer - System drives and devices';
        iconId = 'computer';
        break;

      case 'Recycle Bin':
        windowContent = 'Recycle Bin - Deleted items';
        iconId = 'recycle';
        break;

      default:
        windowContent = `System item: ${displayName}`;
        // Use the display name to determine icon
        iconId = displayName.toLowerCase().replace(/\s+/g, '-');
    }

    dispatch(
      openWindow({
        title: displayName,
        content: windowContent,
        icon: iconId,
        x: 100 + Math.random() * 100,
        y: 100 + Math.random() * 100,
        width: 700,
        height: 500,
        isMinimized: false,
        isMaximized: false,
        isResizable: true,
      })
    );
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
      }}
    >
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          isSelected={selectedIconId === icon.id}
          onSelect={() => dispatch(selectIcon(icon.id))}
          onDoubleClick={() => handleIconDoubleClick(icon.id, icon.name)}
          onMove={(x, y) => dispatch(moveIcon({ id: icon.id, x, y }))}
        />
      ))}
    </div>
  );
};

export default Desktop;
