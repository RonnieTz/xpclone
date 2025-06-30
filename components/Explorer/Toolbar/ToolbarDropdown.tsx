import React from 'react';

interface ToolbarDropdownProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  children?: React.ReactNode;
}

const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  isOpen,
  position,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      data-dropdown
      className="absolute z-50 bg-white"
      style={{
        left: position.x,
        top: position.y,
        overflow: 'visible',
        border: '1px solid #aca899',
        boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.5)',
        padding: 0,
      }}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from closing it
    >
      {children}
    </div>
  );
};

export default ToolbarDropdown;
