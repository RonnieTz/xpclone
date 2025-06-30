'use client';

import React, { useState } from 'react';
import { FileItemProps } from '../types';
import { IconView, ListView, DetailsView } from './FileViews';
import { useDragHandling } from './useDragHandling';

const FileItem: React.FC<FileItemProps> = ({
  file,
  viewMode,
  onDoubleClick,
  onSelect,
  isSelected = false,
  windowId,
  onMove,
  position,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { itemRef, handleMouseDown } = useDragHandling({
    viewMode,
    windowId,
    onMove,
    onSelect,
  });

  const getItemClass = () => {
    const baseClass = 'select-none transition-colors duration-150';

    // View-specific classes
    let viewClass = '';
    switch (viewMode) {
      case 'icons':
        // Use absolute positioning when position is provided (drag mode)
        if (position) {
          viewClass = 'absolute flex flex-col items-center p-1 rounded';
        } else {
          viewClass = 'flex flex-col items-center p-1 rounded';
        }
        break;
      case 'list':
        viewClass = 'hover:bg-blue-50 border-b border-transparent';
        break;
      case 'details':
        viewClass = 'hover:bg-blue-50';
        break;
      case 'thumbnails':
        viewClass = 'rounded border border-transparent p-2';
        break;
    }

    // State classes
    let stateClass = '';
    if (viewMode === 'icons') {
      stateClass = '';
    } else {
      if (isSelected) {
        stateClass = 'bg-blue-100 border-blue-300';
      } else if (isHovered) {
        stateClass = 'bg-blue-50';
      }
    }

    return `${baseClass} ${viewClass} ${stateClass}`.trim();
  };

  const getItemStyle = () => {
    // In icons view with custom position, use absolute positioning
    if (viewMode === 'icons' && position) {
      return {
        left: position.x,
        top: position.y,
        width: '80px',
        zIndex: isSelected ? 10 : 1,
      };
    }
    return {};
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return <ListView file={file} isSelected={isSelected} />;
      case 'details':
        return <DetailsView file={file} isSelected={isSelected} />;
      case 'thumbnails':
        return <IconView file={file} isSelected={isSelected} />;
      default:
        return <IconView file={file} isSelected={isSelected} />;
    }
  };

  return (
    <div
      className={getItemClass()}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && isSelected) {
          onDoubleClick?.();
        }
      }}
      data-file-item
      data-file-type={file.type}
      tabIndex={isSelected ? 0 : -1}
      ref={itemRef}
      onMouseDown={handleMouseDown}
      style={getItemStyle()}
    >
      {renderContent()}
    </div>
  );
};

export default FileItem;
