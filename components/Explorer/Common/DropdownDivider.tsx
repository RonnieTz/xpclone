import React from 'react';

interface DropdownDividerProps {
  margin?: number; // Optional margin above and below
}

const DropdownDivider: React.FC<DropdownDividerProps> = ({ margin = 4 }) => {
  return (
    <div
      style={{
        marginTop: `${margin}px`,
        marginBottom: `${margin}px`,
        marginLeft: '10px',
        marginRight: '10px',
        height: '0px',
        borderTop: '1px solid #aca899',
        // Ensure consistent rendering across different zoom levels and DPI settings
        transform: 'translateZ(0)', // Force hardware acceleration for consistent rendering
      }}
    />
  );
};

export default DropdownDivider;
