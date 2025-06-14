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
  icon: 'drive-c',
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
      icon: 'folder',
      parentId: 'c-drive',
      dateCreated: new Date('2001-10-25'),
      dateModified: new Date(),
      children: [
        {
          id: 'administrator',
          name: 'Administrator',
          type: 'folder',
          path: 'C:\\Documents and Settings\\Administrator',
          icon: 'folder-user',
          parentId: 'documents-and-settings',
          dateCreated: new Date('2001-10-25'),
          dateModified: new Date(),
          children: [
            {
              id: 'desktop-folder',
              name: 'Desktop',
              type: 'folder',
              path: 'C:\\Documents and Settings\\Administrator\\Desktop',
              icon: 'folder-desktop',
              parentId: 'administrator',
              dateCreated: new Date('2001-10-25'),
              dateModified: new Date(),
              children: [
                {
                  id: 'my-computer-shortcut',
                  name: 'My Computer',
                  type: 'shortcut',
                  path: 'C:\\Documents and Settings\\Administrator\\Desktop\\My Computer.lnk',
                  icon: 'computer',
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
                  icon: 'recycle-empty',
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
                  icon: 'folder-documents',
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
                  icon: 'internet-explorer',
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
                  icon: 'text-file',
                  parentId: 'desktop-folder',
                  content: 'Welcome to Windows XP!',
                  extension: 'txt',
                  size: 21,
                  dateCreated: new Date(),
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
