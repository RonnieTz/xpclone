'use client';

import React from 'react';
import { SubmenuProvider } from './SubmenuContext';

interface AllProgramsMenuProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  position: { left: number; bottom: number };
  isSubmenu?: boolean; // Add prop to identify if this is a submenu
}

const AllProgramsMenu: React.FC<AllProgramsMenuProps> = ({
  isVisible,
  onClose,
  children,
  position,
  isSubmenu = false,
}) => {
  if (!isVisible) return null;

  return (
    <>
      <div
        className="absolute bg-white z-50 opacity-0 animate-fade-in"
        style={{
          left: position.left,
          bottom: position.bottom,
          borderTop: '1px solid #55a1ff',
          borderRight: '1px solid #3481e3',
          borderBottom: '1px solid #59a3ff',
          borderLeft: '1px solid #4088e4',
          animation: 'fadeIn 200ms ease-in-out forwards',
          boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Vertical bar on the left side */}
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '5px',
            height: '100%',
            backgroundColor: '#307fe5',
          }}
        />
        <SubmenuProvider>{children}</SubmenuProvider>
      </div>

      {/* Only add overlay for main menu, not for submenus */}
      {!isSubmenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
          style={{ backgroundColor: 'transparent' }}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default AllProgramsMenu;
