import { FileSystemItem } from '@/lib/filesystem';
import { FileItem } from './FolderContent/types'; // Use existing FileItem interface

// Helper function to get window title from path
export const getWindowTitle = (targetPath: string): string => {
  if (targetPath === 'My Computer' || targetPath === '') {
    return 'My Computer';
  }
  if (targetPath === 'Recycle Bin') {
    return 'Recycle Bin';
  }

  // Get the folder name from the path
  const pathParts = targetPath.split('\\').filter(Boolean);
  if (pathParts.length === 0) return 'My Computer';

  const folderName = pathParts[pathParts.length - 1];
  return folderName;
};

// Helper function to get window content for path
export const getWindowContent = (targetPath: string): string => {
  if (targetPath === 'My Computer') {
    return 'My Computer';
  }
  if (targetPath === 'Recycle Bin') {
    return 'Recycle Bin';
  }
  return `Folder: ${targetPath}`;
};

// Convert FileSystemItem to FileItem format
export const convertToFileItem = (item: FileSystemItem): FileItem => {
  return {
    id: item.id,
    name: item.name,
    type: item.type === 'folder' ? 'folder' : 'file',
    path: item.path,
    icon: item.icon,
    size: item.size,
    dateModified: item.dateModified, // This is already optional in the original interface
  };
};
