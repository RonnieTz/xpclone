import React from 'react';
import DropdownItem from '../../Common/DropdownItem';
import DropdownDivider from '../../Common/DropdownDivider';

// Help menu items
export const HelpMenuItems: React.FC<{
  windowId?: string;
  onClose?: () => void;
}> = ({ onClose }) => (
  <>
    <DropdownItem text="Help and Support Center" onClick={onClose} />
    <DropdownDivider />
    <DropdownItem text="Is this copy of Windows legal?" onClick={onClose} />
    <DropdownItem text="About Windows" onClick={onClose} />
  </>
);
