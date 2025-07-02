import React from 'react';
import Image from 'next/image';
import { getFileIcon, formatFileSize, formatDate } from '../utils/fileUtils';

interface FileViewProps {
  file: {
    name: string;
    type: string;
    icon?: string;
    size?: number;
    dateModified?: Date;
  };
  isSelected: boolean;
}

export const IconView: React.FC<FileViewProps> = ({ file, isSelected }) => (
  <div
    className="flex flex-col items-center p-1 relative"
    style={{ width: '80px', minWidth: '80px' }}
  >
    {/* Icon Image */}
    <div className="mb-1 select-none">
      <Image
        src={getFileIcon(file)}
        alt={file.name}
        width={32}
        height={32}
        className={`object-contain ${isSelected ? 'brightness-65' : ''}`}
        draggable={false}
      />
    </div>

    {/* Icon Text */}
    <div
      className="text-black text-xs text-center max-w-full break-words select-none leading-tight px-2 py-0.5"
      style={{
        backgroundColor: isSelected ? '#316ac5' : 'transparent',
        color: isSelected ? 'white' : 'black',
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '11px',
      }}
    >
      {file.name}
    </div>
  </div>
);

export const ListView: React.FC<FileViewProps> = ({ file }) => (
  <div className="flex items-center p-1 w-full">
    <Image
      src={getFileIcon(file)}
      alt={file.name}
      width={16}
      height={16}
      className="mr-2 object-contain"
    />
    <span className="text-sm text-black truncate">{file.name}</span>
  </div>
);

export const DetailsView: React.FC<FileViewProps> = ({ file }) => (
  <div className="flex items-center p-1 w-full border-b border-gray-100">
    <div className="flex items-center flex-1 min-w-0">
      <Image
        src={getFileIcon(file)}
        alt={file.name}
        width={16}
        height={16}
        className="mr-2 object-contain flex-shrink-0"
      />
      <span className="text-sm text-black truncate">{file.name}</span>
    </div>
    <div className="w-20 text-xs text-black text-right">
      {formatFileSize(file.size)}
    </div>
    <div className="w-32 text-xs text-black text-right ml-2">
      {file.type === 'folder' ? 'Folder' : 'File'}
    </div>
    <div className="w-40 text-xs text-black text-right ml-2">
      {formatDate(file.dateModified)}
    </div>
  </div>
);
