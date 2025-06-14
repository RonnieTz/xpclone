import React, { useRef, useState } from 'react';

interface ToolbarItemProps {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  isActive?: boolean;
}

const ToolbarItem: React.FC<ToolbarItemProps> = ({
  label,
  onClick,
  onMouseEnter,
  isActive = false,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const applyHoverStyle = (element: HTMLDivElement) => {
    element.style.backgroundColor = '#1d57c6';
    element.style.color = 'white';
  };

  const removeHoverStyle = (element: HTMLDivElement) => {
    element.style.backgroundColor = 'transparent';
    element.style.color = 'black';
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    if (!isActive) {
      const target = e.currentTarget as HTMLDivElement;
      applyHoverStyle(target);
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsHovered(false);
    if (!isActive) {
      const target = e.currentTarget as HTMLDivElement;
      removeHoverStyle(target);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);

    // After click, if mouse is still hovering and item is no longer active, reapply hover
    setTimeout(() => {
      if (isHovered && !isActive && itemRef.current) {
        applyHoverStyle(itemRef.current);
      }
    }, 0);
  };

  // Apply hover style when item becomes inactive while mouse is still hovering
  React.useEffect(() => {
    if (isHovered && !isActive && itemRef.current) {
      applyHoverStyle(itemRef.current);
    } else if (!isHovered && !isActive && itemRef.current) {
      removeHoverStyle(itemRef.current);
    }
  }, [isActive, isHovered]);

  return (
    <div
      ref={itemRef}
      data-toolbar-item
      className="px-2 cursor-pointer text-black relative"
      style={{
        height: '30px',
        lineHeight: '30px',
        backgroundColor: isActive ? '#316ac5' : 'transparent',
        color: isActive ? 'white' : 'black',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

export default ToolbarItem;
