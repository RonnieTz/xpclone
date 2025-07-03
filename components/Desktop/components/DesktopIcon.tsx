'use client';

import React from 'react';
import Image from 'next/image';
import { DesktopIcon as DesktopIconType } from '@/lib/slices/desktopSlice';
import { getIconPath } from '@/lib/iconMapping';
import { useUnifiedDragDrop } from '../../Common/Item/hooks/useUnifiedDragDrop';

interface DesktopIconProps {
  icon: DesktopIconType;
  isSelected: boolean;
  onSelect: (event?: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onMove: (x: number, y: number) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon,
  isSelected,
  onSelect,
  onDoubleClick,
  onMove,
}) => {
  // Convert DesktopIcon to UnifiedItemData format
  const unifiedItem = {
    id: icon.fileSystemItem?.id || icon.name,
    name: icon.name,
    type: icon.fileSystemItem?.type || 'file',
    path: 'C:\\Documents and Settings\\Administrator\\Desktop',
    fileSystemItem: icon.fileSystemItem,
    icon: icon.icon,
    x: icon.x,
    y: icon.y,
  };

  const { itemRef, handleMouseDown, isDragging } = useUnifiedDragDrop({
    item: unifiedItem,
    context: 'desktop',
    onSelect,
    onMove,
  });

  return (
    <div
      ref={itemRef}
      className="absolute flex flex-col items-center p-1 rounded"
      style={{
        left: icon.x,
        top: icon.y,
        width: '80px',
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
      data-desktop-icon
    >
      {/* Icon Image */}
      <div className="mb-1 select-none">
        <Image
          src={`/${getIconPath(icon.icon)}`}
          alt={icon.name}
          width={32}
          height={32}
          className={`object-contain ${isSelected ? 'brightness-65' : ''} ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          draggable={false}
        />
      </div>

      {/* Icon Text */}
      <div
        className={`text-white text-xs text-center max-w-full break-words select-none leading-tight px-2 py-0.5 `}
        style={{
          backgroundColor: isSelected ? '#316ac5' : 'transparent',
          textShadow: isSelected
            ? 'none'
            : '1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 1px rgba(0, 0, 0, 0.5)',
          fontFamily: 'Tahoma, Arial, sans-serif',
          fontSize: '11px',
        }}
      >
        {icon.name}
      </div>
    </div>
  );
};

export default DesktopIcon;
