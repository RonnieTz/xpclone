'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface DropdownItemProps {
  text: string;
  enabled?: boolean;
  icon?: string; // Optional icon path
  tick?: boolean; // Show tick mark
  dot?: boolean; // Show dot mark
  expandArrow?: boolean; // Show expand arrow on the right
  secondaryText?: string; // Optional secondary text (like keyboard shortcuts)
  onClick?: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  text,
  enabled = true,
  icon,
  tick = false,
  dot = false,
  expandArrow = false,
  secondaryText,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (enabled && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (enabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (enabled) {
      setIsHovered(false);
    }
  };

  return (
    <div
      className={`flex items-center py-1 select-none ${
        enabled ? 'cursor-pointer' : 'cursor-default'
      }`}
      style={{
        height: '30px',
        backgroundColor: isHovered && enabled ? '#316ac5' : 'transparent',
        color: enabled ? (isHovered ? 'white' : 'black') : '#aca899',
        paddingLeft: 2,
      }}
      onClick={handleClick}
      onMouseEnter={enabled ? handleMouseEnter : undefined}
      onMouseLeave={enabled ? handleMouseLeave : undefined}
    >
      {/* Left side - Icon, Tick, or Dot area (fixed width for alignment) */}
      <div
        className="flex items-center justify-center"
        style={{ width: '20px', height: '16px' }}
      >
        {icon && (
          <Image
            src={icon}
            alt=""
            width={22}
            height={22}
            className="object-contain"
          />
        )}
        {tick && !icon && (
          <div
            className="font-bold text-center"
            style={{
              fontSize: '14px',
              lineHeight: '16px',
              color: isHovered ? 'white' : 'black',
            }}
          >
            ✓
          </div>
        )}
        {dot && !icon && !tick && (
          <div
            className="rounded-full"
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: isHovered ? 'white' : 'black',
            }}
          />
        )}
      </div>

      {/* Text content */}
      <div
        className="flex-1 text-left px-1"
        style={{
          fontSize: '14px',
          fontFamily: 'Tahoma, Arial, Helvetica, sans-serif',
          lineHeight: '16px',
          color: enabled ? (isHovered ? 'white' : 'black') : '#aca899',
        }}
      >
        {text}
      </div>

      {/* Secondary text (like keyboard shortcuts) - right aligned */}
      {secondaryText && (
        <div
          className="text-right ml-10"
          style={{
            fontSize: '14px',
            fontFamily: 'Tahoma, Arial, Helvetica, sans-serif',
            lineHeight: '16px',
            color: enabled ? (isHovered ? 'white' : '#666') : '#aca899',
            minWidth: '40px',
          }}
        >
          {secondaryText}
        </div>
      )}

      {/* Right side - Expand arrow */}
      <div
        className="flex items-center justify-center"
        style={{ width: '16px', height: '16px' }}
      >
        {expandArrow && (
          <div
            className="text-center"
            style={{
              fontSize: '8px',
              lineHeight: '16px',
              color: enabled ? (isHovered ? 'white' : 'black') : '#aca899',
            }}
          >
            ▶
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownItem;
