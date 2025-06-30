import React from 'react';
import { useDispatch } from 'react-redux';
import { closeWindow } from '@/lib/slices/windowsSlice';
import { removeTaskbarItem } from '@/lib/slices/taskbarSlice';
import DropdownItem from '../../Common/DropdownItem';
import DropdownDivider from '../../Common/DropdownDivider';

// File menu items
export const FileMenuItems: React.FC<{
  windowId?: string;
  onClose?: () => void;
}> = ({ windowId, onClose }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    if (windowId) {
      dispatch(closeWindow(windowId));
      dispatch(removeTaskbarItem(windowId));
    }
    onClose?.();
  };

  return (
    <>
      <DropdownItem text="Create Shortcut" enabled={true} onClick={onClose} />
      <DropdownItem text="Delete" enabled={true} onClick={onClose} />
      <DropdownItem text="Rename" enabled={false} onClick={onClose} />
      <DropdownItem text="Properties" onClick={onClose} />
      <DropdownDivider />
      <DropdownItem text="Close" onClick={handleClose} />
    </>
  );
};
