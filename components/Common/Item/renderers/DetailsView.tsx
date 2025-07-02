import React from 'react';
import Image from 'next/image';
import { ItemRenderProps } from '../types';

export const DetailsView: React.FC<ItemRenderProps> = ({
  item,
  getIconSrc,
  getIconSize,
}) => {
  const iconSize = getIconSize();

  const formatFileSize = (size?: number): string => {
    if (!size) return '';
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <div className="flex items-center flex-1 min-w-0">
        <Image
          src={getIconSrc()}
          alt={item.name}
          width={iconSize.width}
          height={iconSize.height}
          className="mr-2 object-contain flex-shrink-0"
        />
        <span className="text-sm text-black truncate">{item.name}</span>
      </div>
      <div className="w-20 text-xs text-black text-right">
        {formatFileSize(item.size)}
      </div>
      <div className="w-32 text-xs text-black text-right ml-2">
        {item.type === 'folder' ? 'Folder' : 'File'}
      </div>
      <div className="w-40 text-xs text-black text-right ml-2">
        {formatDate(item.dateModified)}
      </div>
    </>
  );
};
