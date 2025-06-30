// File system item types
type FileSystemItemType =
  | 'folder'
  | 'file'
  | 'program'
  | 'image'
  | 'sound'
  | 'shortcut'
  | 'drive';

export interface BaseItem {
  id: string;
  name: string;
  type: FileSystemItemType;
  parentId?: string; // undefined for root
  path: string; // Full path in Windows format
  icon?: string; // Icon identifier
  size?: number; // Size in bytes
  dateCreated?: Date;
  dateModified?: Date;
}

export interface Folder extends BaseItem {
  type: 'folder';
  children: FileSystemItem[];
}

export interface FileDocument extends BaseItem {
  type: 'file';
  content: string;
  extension: string;
}

export interface Program extends BaseItem {
  type: 'program';
  executable: string;
  extension: string;
}

export interface ImageFile extends BaseItem {
  type: 'image';
  resolution: string;
  extension: string;
}

export interface SoundFile extends BaseItem {
  type: 'sound';
  duration: number;
  extension: string;
}

export interface Shortcut extends BaseItem {
  type: 'shortcut';
  targetId: string;
  targetPath: string;
}

export interface Drive extends BaseItem {
  type: 'drive';
  letter: string;
  totalSpace: number;
  freeSpace: number;
  children: FileSystemItem[];
}

export type FileSystemItem =
  | Folder
  | FileDocument
  | Program
  | ImageFile
  | SoundFile
  | Shortcut
  | Drive;

// Windows XP-style file system structure
export const windowsXPFileSystem: Drive = {
  id: 'c-drive',
  name: 'Local Disk (C:)',
  type: 'drive',
  letter: 'C',
  path: 'C:\\',
  icon: 'My Computer.png',
  totalSpace: 40000000000, // 40GB
  freeSpace: 25000000000, // 25GB free
  dateCreated: new Date('2001-10-25'),
  dateModified: new Date(),
  children: [
    {
      id: 'documents-and-settings',
      name: 'Documents and Settings',
      type: 'folder',
      path: 'C:\\Documents and Settings',
      icon: 'Folder Closed.png',
      parentId: 'c-drive',
      dateCreated: new Date('2001-10-25'),
      dateModified: new Date(),
      children: [
        {
          id: 'administrator',
          name: 'Administrator',
          type: 'folder',
          path: 'C:\\Documents and Settings\\Administrator',
          icon: 'Folder Closed.png',
          parentId: 'documents-and-settings',
          dateCreated: new Date('2001-10-25'),
          dateModified: new Date(),
          children: [
            {
              id: 'desktop-folder',
              name: 'Desktop',
              type: 'folder',
              path: 'C:\\Documents and Settings\\Administrator\\Desktop',
              icon: 'Desktop.png',
              parentId: 'administrator',
              dateCreated: new Date('2001-10-25'),
              dateModified: new Date(),
              children: [
                {
                  id: 'my-computer-shortcut',
                  name: 'My Computer',
                  type: 'shortcut',
                  path: 'C:\\Documents and Settings\\Administrator\\Desktop\\My Computer.lnk',
                  icon: 'My Computer.png',
                  parentId: 'desktop-folder',
                  targetId: 'my-computer',
                  targetPath: 'My Computer',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                },
                {
                  id: 'recycle-bin-shortcut',
                  name: 'Recycle Bin',
                  type: 'shortcut',
                  path: 'C:\\Documents and Settings\\Administrator\\Desktop\\Recycle Bin.lnk',
                  icon: 'Recycle Bin (empty).png',
                  parentId: 'desktop-folder',
                  targetId: 'recycle-bin',
                  targetPath: 'Recycle Bin',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                },
                {
                  id: 'my-documents-shortcut',
                  name: 'My Documents',
                  type: 'shortcut',
                  path: 'C:\\Documents and Settings\\Administrator\\Desktop\\My Documents.lnk',
                  icon: 'My Documents.png',
                  parentId: 'desktop-folder',
                  targetId: 'my-documents',
                  targetPath:
                    'C:\\Documents and Settings\\Administrator\\My Documents',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                },
                {
                  id: 'internet-explorer-shortcut',
                  name: 'Internet Explorer',
                  type: 'shortcut',
                  path: 'C:\\Documents and Settings\\Administrator\\Desktop\\Internet Explorer.lnk',
                  icon: 'Internet Explorer.png',
                  parentId: 'desktop-folder',
                  targetId: 'internet-explorer',
                  targetPath:
                    'C:\\Program Files\\Internet Explorer\\iexplore.exe',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                },
                {
                  id: 'sample-document',
                  name: 'New Text Document.txt',
                  type: 'file',
                  path: 'C:\\Documents and Settings\\Administrator\\Desktop\\New Text Document.txt',
                  icon: 'Notepad.png',
                  parentId: 'desktop-folder',
                  content: 'Welcome to Windows XP!',
                  extension: 'txt',
                  size: 21,
                  dateCreated: new Date(),
                  dateModified: new Date(),
                },
              ],
            },
            {
              id: 'my-documents',
              name: 'My Documents',
              type: 'folder',
              path: 'C:\\Documents and Settings\\Administrator\\My Documents',
              icon: 'My Documents.png',
              parentId: 'administrator',
              dateCreated: new Date('2001-10-25'),
              dateModified: new Date(),
              children: [
                {
                  id: 'my-pictures',
                  name: 'My Pictures',
                  type: 'folder',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\My Pictures',
                  icon: 'My Pictures.png',
                  parentId: 'my-documents',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                  children: [
                    {
                      id: 'sample-photos',
                      name: 'Sample Pictures',
                      type: 'folder',
                      path: 'C:\\Documents and Settings\\Administrator\\My Documents\\My Pictures\\Sample Pictures',
                      icon: 'Folder Closed.png',
                      parentId: 'my-pictures',
                      dateCreated: new Date('2001-10-25'),
                      dateModified: new Date(),
                      children: [],
                    },
                  ],
                },
                {
                  id: 'my-music',
                  name: 'My Music',
                  type: 'folder',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\My Music',
                  icon: 'My Music.png',
                  parentId: 'my-documents',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                  children: [
                    {
                      id: 'sample-music',
                      name: 'Sample Music',
                      type: 'folder',
                      path: 'C:\\Documents and Settings\\Administrator\\My Documents\\My Music\\Sample Music',
                      icon: 'Folder Closed.png',
                      parentId: 'my-music',
                      dateCreated: new Date('2001-10-25'),
                      dateModified: new Date(),
                      children: [],
                    },
                  ],
                },
                {
                  id: 'my-videos',
                  name: 'My Videos',
                  type: 'folder',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\My Videos',
                  icon: 'My Videos.png',
                  parentId: 'my-documents',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                  children: [],
                },
                {
                  id: 'my-received-files',
                  name: 'My Received Files',
                  type: 'folder',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\My Received Files',
                  icon: 'Folder Closed.png',
                  parentId: 'my-documents',
                  dateCreated: new Date('2001-10-25'),
                  dateModified: new Date(),
                  children: [],
                },
                {
                  id: 'project-files',
                  name: 'Project Files',
                  type: 'folder',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\Project Files',
                  icon: 'Folder Closed.png',
                  parentId: 'my-documents',
                  dateCreated: new Date('2025-06-28'),
                  dateModified: new Date(),
                  children: [],
                },
                {
                  id: 'work-documents',
                  name: 'Work Documents',
                  type: 'folder',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\Work Documents',
                  icon: 'Folder Closed.png',
                  parentId: 'my-documents',
                  dateCreated: new Date('2025-06-28'),
                  dateModified: new Date(),
                  children: [],
                },
                {
                  id: 'personal-files',
                  name: 'Personal Files',
                  type: 'folder',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\Personal Files',
                  icon: 'Folder Closed.png',
                  parentId: 'my-documents',
                  dateCreated: new Date('2025-06-28'),
                  dateModified: new Date(),
                  children: [],
                },
                {
                  id: 'readme-doc',
                  name: 'ReadMe.txt',
                  type: 'file',
                  path: 'C:\\Documents and Settings\\Administrator\\My Documents\\ReadMe.txt',
                  icon: 'Notepad.png',
                  parentId: 'my-documents',
                  content:
                    'Welcome to your My Documents folder! This is where you can store your personal files and documents.',
                  extension: 'txt',
                  size: 95,
                  dateCreated: new Date('2025-06-28'),
                  dateModified: new Date(),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions
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

// Add new functions for file system operations
export function moveItemToPath(
  itemId: string,
  targetPath: string,
  root: FileSystemItem = windowsXPFileSystem
): boolean {
  // Find the item and its current parent
  const item = findItemById(itemId, root);
  if (!item) return false;

  const currentParent = findParentItem(itemId, root);
  if (!currentParent || !('children' in currentParent)) return false;

  // Find the target folder
  const targetFolder = findItemByPath(targetPath, root);
  if (!targetFolder || !('children' in targetFolder)) return false;

  // Remove item from current parent
  const itemIndex = currentParent.children.findIndex(
    (child) => child.id === itemId
  );
  if (itemIndex === -1) return false;

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
    movedItem.children = updateChildrenPathsImmutable(
      movedItem.children,
      newPath
    );
  }

  // Add item to target folder
  targetFolder.children.push(movedItem);

  return true;
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

function updateChildrenPaths(item: FileSystemItem, newBasePath: string): void {
  if ('children' in item) {
    item.children.forEach((child) => {
      child.path = `${newBasePath}\\${child.name}`;
      if ('children' in child) {
        updateChildrenPaths(child, child.path);
      }
    });
  }
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

function updateChildrenPathsImmutable(
  children: FileSystemItem[],
  newBasePath: string
): FileSystemItem[] {
  return children.map((child) => {
    const newPath = `${newBasePath}\\${child.name}`;
    const newChild: FileSystemItem = {
      ...child,
      path: newPath,
      dateModified: new Date(),
    };

    if ('children' in newChild) {
      newChild.children = updateChildrenPathsImmutable(
        newChild.children,
        newPath
      );
    }

    return newChild;
  });
}
