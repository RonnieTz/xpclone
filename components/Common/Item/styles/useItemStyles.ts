import React from 'react';
import { UnifiedItemData } from '../types';

export const useItemStyles = (
  item: UnifiedItemData,
  context: 'desktop' | 'folder',
  viewMode: 'icons' | 'list' | 'details' | 'thumbnails',
  isSelected: boolean,
  isHovered: boolean,
  position?: { x: number; y: number },
  className?: string,
  style?: React.CSSProperties
) => {
  const getItemClasses = () => {
    const baseClass = 'select-none transition-colors duration-150';

    if (context === 'desktop') {
      return `${baseClass} absolute flex flex-col items-center p-1 rounded ${className}`;
    }

    // Folder context classes based on view mode
    let viewClass = '';
    switch (viewMode) {
      case 'icons':
        if (position) {
          viewClass = 'absolute flex flex-col items-center p-1 rounded';
        } else {
          viewClass = 'flex flex-col items-center p-1 rounded';
        }
        break;
      case 'list':
        viewClass =
          'flex items-center p-1 w-full hover:bg-blue-50 border-b border-transparent';
        break;
      case 'details':
        viewClass =
          'flex items-center p-1 w-full hover:bg-blue-50 border-b border-gray-100';
        break;
      case 'thumbnails':
        viewClass = 'rounded border border-transparent p-2';
        break;
    }

    // Selection state
    let stateClass = '';
    if (context === 'folder' && viewMode !== 'icons') {
      if (isSelected) {
        stateClass = 'bg-blue-100 border-blue-300';
      } else if (isHovered) {
        stateClass = 'bg-blue-50';
      }
    }

    return `${baseClass} ${viewClass} ${stateClass} ${className}`.trim();
  };

  const getItemStyle = (): React.CSSProperties => {
    const baseStyle = { ...style };

    if (context === 'desktop') {
      return {
        ...baseStyle,
        left: item.x || 0,
        top: item.y || 0,
        width: '80px',
        zIndex: isSelected ? 10 : 1,
      };
    }

    if (context === 'folder' && viewMode === 'icons' && position) {
      return {
        ...baseStyle,
        left: position.x,
        top: position.y,
        width: '80px',
        zIndex: isSelected ? 10 : 1,
      };
    }

    return baseStyle;
  };

  const getIconSize = () => {
    if (context === 'desktop') return { width: 32, height: 32 };

    switch (viewMode) {
      case 'icons':
      case 'thumbnails':
        return { width: 32, height: 32 };
      case 'list':
      case 'details':
        return { width: 16, height: 16 };
      default:
        return { width: 32, height: 32 };
    }
  };

  return {
    getItemClasses,
    getItemStyle,
    getIconSize,
  };
};
