import { Dispatch } from '@reduxjs/toolkit';
import { FileSystemItem, findItemById } from '@/lib/filesystem';
import { openWindow, openOrFocusWindow } from '@/lib/slices/windowsSlice';

export const isFolderLike = (item: FileSystemItem, name: string): boolean => {
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
    return folderLikePaths.some((path) => shortcut.targetPath.includes(path));
  }

  return false;
};

export const handleFolderLikeItemOpen = (
  item: FileSystemItem,
  displayName: string,
  dispatch: Dispatch
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
    openOrFocusWindow({
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

export const handleFileSystemItemOpen = (
  item: FileSystemItem,
  displayName: string,
  dispatch: Dispatch
) => {
  let windowContent = '';
  const iconId = item.icon || 'file';

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

  // Use openOrFocusWindow for folders to prevent duplicates
  const openAction = item.type === 'folder' ? openOrFocusWindow : openWindow;

  dispatch(
    openAction({
      title: displayName,
      content: windowContent,
      icon: iconId,
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      width: item.type === 'folder' ? 700 : 600,
      height: item.type === 'folder' ? 500 : 400,
      isMinimized: false,
      isMaximized: false,
      isResizable: true,
    })
  );
};

export const handleSpecialShortcut = (
  targetPath: string,
  displayName: string,
  dispatch: Dispatch
) => {
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

  // Use openOrFocusWindow for special shortcuts that open folder-like windows
  const isFolderLikeShortcut =
    targetPath === 'My Computer' || targetPath === 'Recycle Bin';
  const openAction = isFolderLikeShortcut ? openOrFocusWindow : openWindow;

  dispatch(
    openAction({
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

export const handleIconDoubleClick = (
  iconId: string,
  iconName: string,
  icons: { id: string; fileSystemItem?: FileSystemItem }[],
  dispatch: Dispatch
) => {
  const icon = icons.find((i) => i.id === iconId);
  const fileSystemItem = icon?.fileSystemItem;

  if (!fileSystemItem) return;

  // Check if this is a folder-like item that should open Explorer
  if (isFolderLike(fileSystemItem, iconName)) {
    handleFolderLikeItemOpen(fileSystemItem, iconName, dispatch);
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
        handleFileSystemItemOpen(targetItem, iconName, dispatch);
      } else {
        // If target not found, try to handle by targetPath
        handleSpecialShortcut(shortcut.targetPath, iconName, dispatch);
      }
      break;

    case 'file':
      handleFileSystemItemOpen(fileSystemItem, iconName, dispatch);
      break;

    case 'folder':
      handleFileSystemItemOpen(fileSystemItem, iconName, dispatch);
      break;

    case 'program':
      handleFileSystemItemOpen(fileSystemItem, iconName, dispatch);
      break;

    default:
      handleFileSystemItemOpen(fileSystemItem, iconName, dispatch);
  }
};
