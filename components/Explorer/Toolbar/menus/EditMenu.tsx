import React from 'react';
import DropdownItem from '../../Common/DropdownItem';
import DropdownDivider from '../../Common/DropdownDivider';

// Edit menu items
export const EditMenuItems: React.FC<{
  windowId?: string;
  onClose?: () => void;
  onSelectAll?: () => void;
}> = ({ onClose, onSelectAll }) => {
  const handleSelectAll = () => {
    onSelectAll?.();
    onClose?.();
  };

  return (
    <>
      <DropdownItem
        text="Undo Copy"
        secondaryText="Ctrl+Z"
        enabled={false}
        onClick={onClose}
      />
      <DropdownDivider />
      <DropdownItem
        text="Cut"
        secondaryText="Ctrl+X"
        enabled={false}
        onClick={onClose}
      />
      <DropdownItem
        text="Copy"
        secondaryText="Ctrl+C"
        enabled={false}
        onClick={onClose}
      />
      <DropdownItem
        text="Paste"
        secondaryText="Ctrl+V"
        enabled={false}
        onClick={onClose}
      />
      <DropdownItem text="Paste Shortcut" enabled={false} onClick={onClose} />
      <DropdownDivider />
      <DropdownItem
        text="Copy to Folder..."
        enabled={false}
        onClick={onClose}
      />
      <DropdownItem
        text="Move to Folder..."
        enabled={false}
        onClick={onClose}
      />
      <DropdownDivider />
      <DropdownItem
        text="Select All"
        secondaryText="Ctrl+A"
        onClick={handleSelectAll}
      />
      <DropdownItem text="Invert Selection" onClick={onClose} />
    </>
  );
};
