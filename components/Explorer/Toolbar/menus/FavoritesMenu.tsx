import React from 'react';
import DropdownItem from '../../Common/DropdownItem';
import DropdownDivider from '../../Common/DropdownDivider';
import { Submenu } from '../menuHelpers';

// Favorites menu items
export const FavoritesMenuItems: React.FC<{
  windowId?: string;
  onClose?: () => void;
}> = ({ onClose }) => (
  <>
    <DropdownItem text="Add to Favorites..." onClick={onClose} />
    <DropdownItem text="Organize Favorites..." onClick={onClose} />
    <DropdownDivider />
    <DropdownItem text="Links" expandArrow={true} icon="/Folder Closed.png">
      <Submenu>
        <DropdownItem
          text="Customize Links"
          icon="/URL.png"
          onClick={onClose}
        />
        <DropdownItem text="Free Hotmail" icon="/URL.png" onClick={onClose} />
        <DropdownItem text="Windows" icon="/URL.png" onClick={onClose} />
        <DropdownItem
          text="Windows Marketplace"
          icon="/Windows Catalog.png"
          onClick={onClose}
        />
        <DropdownItem text="Windows Media" icon="/URL.png" onClick={onClose} />
      </Submenu>
    </DropdownItem>
    <DropdownItem text="MSN.com" icon="/URL.png" onClick={onClose} />
    <DropdownItem
      text="Radio Station Guide"
      icon="/URL.png"
      onClick={onClose}
    />
  </>
);
