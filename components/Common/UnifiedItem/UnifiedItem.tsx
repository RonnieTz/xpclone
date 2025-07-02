'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { getIconPath } from '@/lib/iconMapping';

export interface UnifiedItemData {
  id: string;
  name: string;
  icon?: string;
  type: 'file' | 'folder' | 'application' | 'shortcut';
  size?: number;
  dateModified?: Date;
  path?: string;
  // Position for drag & drop
  x?: number;
  y?: number;
}

export interface UnifiedItemProps {
  item: UnifiedItemData;
  context: 'desktop' | 'folder';
  viewMode?: 'icons' | 'list' | 'details' | 'thumbnails';
  isSelected?: boolean;
  position?: { x: number; y: number };

  // Event handlers
  onSelect?: (event?: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  onMove?: (x: number, y: number) => void;

  // Context-specific styling
  className?: string;
  style?: React.CSSProperties;
}

const UnifiedItem: React.FC<UnifiedItemProps> = ({
  item,
  context,
  viewMode = 'icons',
  isSelected = false,
  position,
  onSelect,
  onDoubleClick,
  onMove,
  className = '',
  style = {},
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button

    e.preventDefault();
    e.stopPropagation();

    onSelect?.(e);

    // Handle drag functionality if onMove is provided
    if (onMove) {
      let isDragging = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const threshold = 5;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = Math.abs(moveEvent.clientX - startX);
        const deltaY = Math.abs(moveEvent.clientY - startY);

        if (!isDragging && (deltaX > threshold || deltaY > threshold)) {
          isDragging = true;
        }

        if (isDragging) {
          const rect = itemRef.current?.offsetParent?.getBoundingClientRect();
          if (rect) {
            const newX = Math.max(0, moveEvent.clientX - rect.left - 40);
            const newY = Math.max(0, moveEvent.clientY - rect.top - 40);
            onMove(newX, newY);
          }
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const getIconSrc = () => {
    if (item.icon) {
      return item.icon.startsWith('/')
        ? item.icon
        : `/${getIconPath(item.icon)}`;
    }
    return `/${getIconPath(item.type)}`;
  };

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

  const renderIconView = () => {
    const iconSize = getIconSize();
    const isDesktop = context === 'desktop';

    return (
      <>
        <div className="mb-1 select-none">
          <Image
            src={getIconSrc()}
            alt={item.name}
            width={iconSize.width}
            height={iconSize.height}
            className={`object-contain ${
              isSelected && isDesktop ? 'brightness-65' : ''
            }`}
            draggable={false}
          />
        </div>
        <div
          className={`text-xs text-center max-w-full break-words select-none leading-tight px-2 py-0.5`}
          style={{
            backgroundColor: isSelected ? '#316ac5' : 'transparent',
            color: isDesktop
              ? isSelected
                ? 'white'
                : 'white'
              : isSelected
              ? 'white'
              : 'black',
            textShadow:
              isDesktop && !isSelected
                ? '1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 1px rgba(0, 0, 0, 0.5)'
                : 'none',
            fontFamily: 'Tahoma, Arial, sans-serif',
            fontSize: '11px',
          }}
        >
          {item.name}
        </div>
      </>
    );
  };

  const renderListView = () => {
    const iconSize = getIconSize();

    return (
      <>
        <Image
          src={getIconSrc()}
          alt={item.name}
          width={iconSize.width}
          height={iconSize.height}
          className="mr-2 object-contain"
        />
        <span className="text-sm text-black truncate">{item.name}</span>
      </>
    );
  };

  const renderDetailsView = () => {
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

  const renderContent = () => {
    if (
      context === 'desktop' ||
      viewMode === 'icons' ||
      viewMode === 'thumbnails'
    ) {
      return renderIconView();
    }

    switch (viewMode) {
      case 'list':
        return renderListView();
      case 'details':
        return renderDetailsView();
      default:
        return renderIconView();
    }
  };

  return (
    <div
      ref={itemRef}
      className={getItemClasses()}
      style={getItemStyle()}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && isSelected) {
          onDoubleClick?.();
        }
      }}
      tabIndex={isSelected ? 0 : -1}
      data-unified-item
      data-context={context}
      data-item-type={item.type}
    >
      {renderContent()}
    </div>
  );
};

export default UnifiedItem;
