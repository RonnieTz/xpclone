'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { DesktopIcon as DesktopIconType } from '@/lib/slices/desktopSlice';
import { getIconPath } from '@/lib/iconMapping';

interface DesktopIconProps {
  icon: DesktopIconType;
  isSelected: boolean;
  onSelect: () => void;
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect();

    const rect = iconRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onMove(Math.max(0, newX), Math.max(0, newY));
      }
    },
    [isDragging, dragOffset.x, dragOffset.y, onMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={iconRef}
      className="absolute flex flex-col items-center cursor-pointer p-1 rounded"
      style={{
        left: icon.x,
        top: icon.y,
        width: '80px',
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
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
