import { DesktopIcon } from '@/lib/slices/desktopSlice';
import { FileItem } from '@/components/Explorer/FolderContent/types';
import { UnifiedItemData } from './UnifiedItem';

// Convert DesktopIcon to UnifiedItemData
export const convertDesktopIconToUnified = (
  desktopIcon: DesktopIcon
): UnifiedItemData => {
  return {
    id: desktopIcon.id,
    name: desktopIcon.name,
    icon: desktopIcon.icon,
    type: desktopIcon.type,
    x: desktopIcon.x,
    y: desktopIcon.y,
    path: desktopIcon.fileSystemItem?.path,
    size: desktopIcon.fileSystemItem?.size,
    dateModified: desktopIcon.fileSystemItem?.dateModified,
  };
};

// Convert FileItem to UnifiedItemData
export const convertFileItemToUnified = (
  fileItem: FileItem
): UnifiedItemData => {
  return {
    id: fileItem.id,
    name: fileItem.name,
    icon: fileItem.icon,
    type: fileItem.type === 'folder' ? 'folder' : 'file',
    path: fileItem.path,
    size: fileItem.size,
    dateModified: fileItem.dateModified,
    x: fileItem.x,
    y: fileItem.y,
  };
};

// Convert UnifiedItemData back to DesktopIcon format
export const convertUnifiedToDesktopIcon = (
  unified: UnifiedItemData
): Partial<DesktopIcon> => {
  return {
    id: unified.id,
    name: unified.name,
    icon: unified.icon || '',
    type: unified.type,
    x: unified.x || 0,
    y: unified.y || 0,
  };
};

// Convert UnifiedItemData back to FileItem format
export const convertUnifiedToFileItem = (
  unified: UnifiedItemData
): Partial<FileItem> => {
  return {
    id: unified.id,
    name: unified.name,
    icon: unified.icon,
    type: unified.type === 'folder' ? 'folder' : 'file',
    path: unified.path || '',
    size: unified.size,
    dateModified: unified.dateModified,
    x: unified.x,
    y: unified.y,
  };
};

// Helper to determine if an item should be draggable
export const isItemDraggable = (
  context: 'desktop' | 'folder',
  viewMode?: string
): boolean => {
  if (context === 'desktop') return true;
  if (context === 'folder' && viewMode === 'icons') return true;
  return false;
};

// Helper to get default icon for item type
export const getDefaultIconForType = (type: string): string => {
  switch (type) {
    case 'folder':
      return 'Folder Closed.png';
    case 'file':
      return 'Default.png';
    case 'application':
      return 'Application.png';
    case 'shortcut':
      return 'Shortcut.png';
    default:
      return 'Default.png';
  }
};
