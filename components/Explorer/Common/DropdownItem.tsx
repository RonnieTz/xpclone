'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  children?: React.ReactNode; // For nested dropdown content
  onSubmenuVisibilityChange?: (visible: boolean) => void;
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
  children,
  onSubmenuVisibilityChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const hasSubmenu = children && expandArrow;

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleClick = () => {
    if (enabled) {
      if (hasSubmenu) {
        // Toggle submenu visibility on click
        const newVisibility = !isSubmenuVisible;

        setIsSubmenuVisible(newVisibility);
        onSubmenuVisibilityChange?.(newVisibility);
      } else if (onClick) {
        onClick();
      }
    }
  };

  const handleMouseEnter = () => {
    if (enabled) {
      setIsHovered(true);

      if (hasSubmenu) {
        clearHoverTimeout();
        // Show submenu after delay
        hoverTimeoutRef.current = setTimeout(() => {
          setIsSubmenuVisible(true);
          onSubmenuVisibilityChange?.(true);
        }, 300);
      }
    }
  };

  const handleMouseLeave = () => {
    if (enabled) {
      setIsHovered(false);
      clearHoverTimeout();

      // Don't immediately hide submenu on mouse leave to allow navigation
      if (hasSubmenu) {
        hoverTimeoutRef.current = setTimeout(() => {
          setIsSubmenuVisible(false);
          onSubmenuVisibilityChange?.(false);
        }, 100);
      }
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => clearHoverTimeout();
  }, []);

  return (
    <>
      <div
        ref={itemRef}
        className={`flex items-center py-1 select-none ${
          enabled ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{
          height: '25px',
          backgroundColor: isHovered && enabled ? '#316ac5' : 'transparent',
          color: enabled ? (isHovered ? 'white' : 'black') : '#aca899',
          paddingLeft: 2,
          position: 'relative',
          overflow: 'visible',
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
            textWrap: 'nowrap',
          }}
        >
          {text}
        </div>

        {/* Secondary text (like keyboard shortcuts) - right aligned */}
        {secondaryText && (
          <div
            className="text-right ml-10"
            style={{
              fontSize: '13px',
              fontFamily: 'Tahoma, Arial, Helvetica, sans-serif',
              lineHeight: '13px',
              color: enabled ? (isHovered ? 'white' : '#000') : '#aca899',
              minWidth: '40px',
              textWrap: 'nowrap',
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
        {isSubmenuVisible && children}
      </div>
    </>
  );
};

export default DropdownItem;
