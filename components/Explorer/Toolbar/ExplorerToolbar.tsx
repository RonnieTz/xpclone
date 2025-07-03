import React from 'react';
import Image from 'next/image';
import ToolbarItem from './ToolbarItem';
import ToolbarDropdown from './ToolbarDropdown';
import { menuItems, getDropdownItems } from './menuData';
import { useDropdownMenu } from './useDropdownMenu';
import { MenuType, ExplorerBarState } from '../types';

interface ExplorerToolbarProps {
  windowId?: string;
  explorerBarState?: ExplorerBarState;
  onExplorerBarStateChange?: (state: ExplorerBarState) => void;
  onSelectAll?: () => void; // Add onSelectAll prop
}

const ExplorerToolbar: React.FC<ExplorerToolbarProps> = ({
  windowId,
  explorerBarState,
  onExplorerBarStateChange,
  onSelectAll,
}) => {
  const {
    activeDropdown,
    dropdownPosition,
    toolbarRef,
    handleItemClick,
    handleItemHover,
    setActiveDropdown,
  } = useDropdownMenu();

  return (
    <div
      ref={toolbarRef}
      className="w-full flex items-center px-1 py-1 relative"
      style={{
        height: '35px',
        backgroundColor: '#efecdc',
        borderBottom: '1px solid #d8d2bd',
      }}
    >
      {menuItems.map((item) => (
        <ToolbarItem
          key={item}
          label={item}
          isActive={activeDropdown === item}
          onClick={(e) => handleItemClick(item, e)}
          onMouseEnter={(e) => handleItemHover(item, e)}
        />
      ))}

      {/* Spacer to push the logo box to the right */}
      <div className="flex-1" />

      {/* XP Logo Box */}
      <div
        className="flex items-center justify-center bg-white"
        style={{
          width: '65px',
          height: '130%',
          borderLeft: '1px solid #aca899',
          translate: '3px',
        }}
      >
        <Image
          src="/XP_logo.webp"
          alt="Windows XP Logo"
          width={30}
          height={30}
          style={{ height: 'auto' }}
          // className="object-contain"
        />
      </div>

      <ToolbarDropdown
        isOpen={activeDropdown !== null}
        position={dropdownPosition}
        onClose={() => setActiveDropdown(null)}
      >
        {activeDropdown &&
          getDropdownItems(
            activeDropdown as MenuType,
            windowId,
            () => setActiveDropdown(null),
            explorerBarState,
            onExplorerBarStateChange,
            onSelectAll // Pass onSelectAll to dropdown items
          )}
      </ToolbarDropdown>
    </div>
  );
};

export default ExplorerToolbar;
