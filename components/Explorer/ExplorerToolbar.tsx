import React from 'react';
import ToolbarItem from './ToolbarItem';
import ToolbarDropdown from './ToolbarDropdown';
import { menuItems, getDropdownItems } from './menuData';
import { useDropdownMenu } from './useDropdownMenu';
import { MenuType } from './types';

const ExplorerToolbar: React.FC = () => {
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

      <ToolbarDropdown
        isOpen={activeDropdown !== null}
        position={dropdownPosition}
        onClose={() => setActiveDropdown(null)}
      >
        {activeDropdown && getDropdownItems(activeDropdown as MenuType)}
      </ToolbarDropdown>
    </div>
  );
};

export default ExplorerToolbar;
