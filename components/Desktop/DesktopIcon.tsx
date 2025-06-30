'use client';

import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { DesktopIcon as DesktopIconType } from '@/lib/slices/desktopSlice';
import { unfocusAllWindows } from '@/lib/slices/windowsSlice';
import { getIconPath } from '@/lib/iconMapping';

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
  const dispatch = useDispatch();
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button

    e.preventDefault();
    e.stopPropagation();

    // Select the icon with event info for multiselect
    onSelect(e);

    let isDragging = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const threshold = 5; // Minimum pixels to move before starting drag

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);

      if (!isDragging && (deltaX > threshold || deltaY > threshold)) {
        // Start drag operation and unfocus all windows
        isDragging = true;
        dispatch(unfocusAllWindows());
      }

      if (isDragging) {
        // Update icon position during drag
        const rect = iconRef.current?.offsetParent?.getBoundingClientRect();
        if (rect) {
          const newX = Math.max(0, moveEvent.clientX - rect.left - 40);
          const newY = Math.max(0, moveEvent.clientY - rect.top - 40);
          onMove(newX, newY);
        }
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={iconRef}
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
          className={`object-contain ${isSelected ? 'brightness-65' : ''}`}
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
