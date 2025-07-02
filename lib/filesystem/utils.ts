import { FileSystemItem } from './types';
import { windowsXPFileSystem } from './mockData';

// Helper functions for filesystem navigation and search
export function findItemByPath(
  path: string,
  root: FileSystemItem = windowsXPFileSystem
): FileSystemItem | null {
  if (root.path === path) {
    return root;
  }

  if ('children' in root) {
    for (const child of root.children) {
      const found = findItemByPath(path, child);
      if (found) return found;
    }
  }

  return null;
}

export function findItemById(
  id: string,
  root: FileSystemItem = windowsXPFileSystem
): FileSystemItem | null {
  if (root.id === id) {
    return root;
  }

  if ('children' in root) {
    for (const child of root.children) {
      const found = findItemById(id, child);
      if (found) return found;
    }
  }

  return null;
}

export function findParentItem(
  itemId: string,
  root: FileSystemItem = windowsXPFileSystem
): FileSystemItem | null {
  if ('children' in root) {
    // Check if any direct child matches
    if (root.children.some((child) => child.id === itemId)) {
      return root;
    }

    // Recursively search in children
    for (const child of root.children) {
      const parent = findParentItem(itemId, child);
      if (parent) return parent;
    }
  }

  return null;
}

export function getDesktopItems(): FileSystemItem[] {
  const desktopFolder = findItemByPath(
    'C:\\Documents and Settings\\Administrator\\Desktop'
  );
  if (desktopFolder && 'children' in desktopFolder) {
    return desktopFolder.children;
  }
  return [];
}

export function getParentPath(path: string): string {
  const lastBackslash = path.lastIndexOf('\\');
  if (lastBackslash > 0) {
    return path.substring(0, lastBackslash);
  }
  return '';
}

export function getItemName(path: string): string {
  const lastBackslash = path.lastIndexOf('\\');
  return path.substring(lastBackslash + 1);
}
