// File utility functions for FileItem components

interface FileForUtils {
  name: string;
  type: string;
  icon?: string;
  size?: number;
  dateModified?: Date;
}

export const getFileIcon = (file: FileForUtils): string => {
  // First priority: use the icon specified in the filesystem data
  if (file.icon) {
    return `/${file.icon}`;
  }

  // Fallback: Default icons based on file type using actual files from public directory
  if (file.type === 'folder') {
    return '/Folder Closed.png'; // Using Folder Closed icon for generic folders
  }

  // Get icon based on file extension as last resort
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'txt':
      return '/Notepad.png';
    case 'exe':
      return '/Application Window.png';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '/Bitmap.png';
    case 'mp3':
    case 'wav':
      return '/Audio CD.png';
    case 'mp4':
    case 'avi':
      return '/Camcorder.png';
    case 'bat':
      return '/BAT.png';
    case 'cab':
      return '/CAB.png';
    case 'css':
      return '/CSS.png';
    default:
      return '/Generic Document.png';
  }
};

export const formatFileSize = (size?: number): string => {
  if (!size) return '';

  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const formatDate = (date?: Date): string => {
  if (!date) return '';
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
