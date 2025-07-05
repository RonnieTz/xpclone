import React from 'react';
import { useDispatch } from 'react-redux';
import { closeWindow } from '@/lib/slices/windowsSlice';
import { removeTaskbarItem } from '@/lib/slices/taskbarSlice';
import { openConfirmationDialog } from '@/lib/utils/modalHelpers';
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

  const handleDelete = () => {
    if (windowId) {
      // Demonstrate modal window functionality with a delete confirmation
      openConfirmationDialog(dispatch, windowId, {
        title: 'Confirm Delete',
        message:
          'Are you sure you want to delete the selected file? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
          // Here you would implement actual delete logic
          console.log('File deleted!');
        },
        onCancel: () => {
          // User cancelled, no action needed
          console.log('Delete cancelled');
        },
      });
    }
    onClose?.();
  };

  return (
    <>
      <DropdownItem text="Create Shortcut" enabled={true} onClick={onClose} />
      <DropdownItem text="Delete" enabled={true} onClick={handleDelete} />
      <DropdownItem text="Rename" enabled={false} onClick={onClose} />
      <DropdownItem text="Properties" onClick={onClose} />
      <DropdownDivider />
      <DropdownItem text="Close" onClick={handleClose} />
    </>
  );
};
