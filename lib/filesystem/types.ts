// File system item types
export type FileSystemItemType =
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
