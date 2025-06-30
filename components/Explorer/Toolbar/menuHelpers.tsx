import React from 'react';
import ToolbarDropdown from './ToolbarDropdown';

// Helper component for menu containers
export const MenuContainer: React.FC<{
  width: string;
  children: React.ReactNode;
}> = ({ width, children }) => <div style={{ minWidth: width }}>{children}</div>;

// Helper component for submenus
export const Submenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ToolbarDropdown isOpen position={{ x: 198, y: 0 }} onClose={() => {}}>
    {children}
  </ToolbarDropdown>
);
