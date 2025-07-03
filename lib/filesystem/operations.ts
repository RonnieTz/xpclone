import { FileSystemItem } from './types';
import { windowsXPFileSystem } from './mockData';
import { findItemById, findParentItem, findItemByPath } from './utils';

// File system operations (move, copy, etc.)
export function moveItemToPath(
  itemId: string,
  targetPath: string,
  root: FileSystemItem = windowsXPFileSystem
): boolean {
  // Find the item and its current parent
  const item = findItemById(itemId, root);
  if (!item) {
    return false;
  }

  const currentParent = findParentItem(itemId, root);
  if (!currentParent || !('children' in currentParent)) {
    return false;
  }

  // Find the target folder
  const targetFolder = findItemByPath(targetPath, root);
  if (!targetFolder || !('children' in targetFolder)) {
    return false;
  }

  // Check if target path is the same as current path (prevent moving to same location)
  if (currentParent.path === targetPath) {
    return false;
  }

  // Prevent moving a folder into itself or its own subfolder
  if (item.type === 'folder') {
    // Check if trying to move folder into itself
    if (item.path === targetPath) {
      if (typeof window !== 'undefined') {
        alert('Cannot move a folder into itself.');
      }
      return false;
    }

    // Check if trying to move folder into its own subfolder
    if (targetPath.startsWith(item.path + '\\')) {
      if (typeof window !== 'undefined') {
        alert(
          `Cannot move "${item.name}" into its own subfolder. This would create a circular reference.`
        );
      }
      return false;
    }
  }

  // Check for name conflicts in target folder
  const nameConflict = targetFolder.children.some(
    (child) => child.name === item.name
  );
  if (nameConflict) {
    if (typeof window !== 'undefined') {
      alert(
        `A file or folder named "${item.name}" already exists in the destination folder.`
      );
    }
    return false;
  }

  // Remove item from current parent
  const itemIndex = currentParent.children.findIndex(
    (child) => child.id === itemId
  );
  if (itemIndex === -1) {
    return false;
  }

  const [originalItem] = currentParent.children.splice(itemIndex, 1);

  // Create a new item object with updated path and parentId (for immutability)
  const newPath = `${targetPath}\\${originalItem.name}`;
  const movedItem = {
    ...originalItem,
    path: newPath,
    parentId: targetFolder.id,
    dateModified: new Date(),
  };

  // If it's a folder, update all children paths recursively
  if ('children' in movedItem) {
    movedItem.children = updateChildrenPaths(
      movedItem.children,
      originalItem.path,
      newPath
    );
  }

  // Add item to target folder
  targetFolder.children.push(movedItem);

  return true;
}

export function copyItemToPath(
  itemId: string,
  targetPath: string,
  root: FileSystemItem = windowsXPFileSystem
): boolean {
  // Find the source item
  const sourceItem = findItemById(itemId, root);
  if (!sourceItem) return false;

  // Find the target folder
  const targetFolder = findItemByPath(targetPath, root);
  if (!targetFolder || !('children' in targetFolder)) return false;

  // Create a copy of the item
  const copiedItem = deepCopyItem(sourceItem, targetFolder.id, targetPath);

  // Add to target folder
  targetFolder.children.push(copiedItem);

  return true;
}

// Helper functions for file operations
function updateChildrenPaths(
  children: FileSystemItem[],
  oldBasePath: string,
  newBasePath: string
): FileSystemItem[] {
  return children.map((child) => {
    const relativePath = child.path.substring(oldBasePath.length);
    const newPath = newBasePath + relativePath;

    const updatedChild = {
      ...child,
      path: newPath,
      dateModified: new Date(),
    };

    // Recursively update children if this is a folder
    if ('children' in updatedChild) {
      return {
        ...updatedChild,
        children: updateChildrenPaths(
          updatedChild.children,
          oldBasePath,
          newBasePath
        ),
      } as FileSystemItem;
    }

    return updatedChild;
  });
}

function deepCopyItem(
  item: FileSystemItem,
  newParentId: string,
  newBasePath: string
): FileSystemItem {
  const newPath = `${newBasePath}\\${item.name}`;

  const baseProps = {
    ...item,
    id: `${item.id}-copy-${Date.now()}`,
    path: newPath,
    parentId: newParentId,
    dateModified: new Date(),
  };

  if ('children' in item) {
    return {
      ...baseProps,
      children: item.children.map((child) =>
        deepCopyItem(child, baseProps.id, newPath)
      ),
    } as FileSystemItem;
  }

  return baseProps;
}
