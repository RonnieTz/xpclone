import React from 'react';
import DropdownItem from '../../Common/DropdownItem';
import DropdownDivider from '../../Common/DropdownDivider';
import FolderOptionsDialog from '../../FolderOptionsDialog';

// Tools menu items
export const ToolsMenuItems: React.FC<{
  windowId?: string;
  onClose?: () => void;
}> = ({ onClose }) => {
  const [showFolderOptions, setShowFolderOptions] = React.useState(false);

  const handleFolderOptionsClick = () => {
    setShowFolderOptions(true);
    onClose?.();
  };

  return (
    <>
      <DropdownItem text="Map Network Drive..." onClick={onClose} />
      <DropdownItem text="Disconnect Network Drive..." onClick={onClose} />
      <DropdownItem text="Synchronize..." onClick={onClose} />
      <DropdownDivider />
      <DropdownItem
        text="Folder Options..."
        onClick={handleFolderOptionsClick}
      />

      {showFolderOptions && (
        <FolderOptionsDialog
          isOpen={showFolderOptions}
          onClose={() => setShowFolderOptions(false)}
        />
      )}
    </>
  );
};
