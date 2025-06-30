'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useFolderOptionsHandlers } from './FolderOptionsDialog/useFolderOptionsHandlers';
import { ToolbarsSection } from './FolderOptionsDialog/ToolbarsSection';
import { ViewSection } from './FolderOptionsDialog/ViewSection';
import { AdvancedSection } from './FolderOptionsDialog/AdvancedSection';
import { DialogButtons } from './FolderOptionsDialog/DialogButtons';

interface FolderOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FolderOptionsDialog: React.FC<FolderOptionsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const folderOptions = useSelector(
    (state: RootState) => state.folderOptions.options
  );

  const {
    handleToggle,
    handleViewTypeChange,
    handleArrangeIconsChange,
    handleRestoreDefaults,
  } = useFolderOptionsHandlers();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white border-2 shadow-lg"
        style={{
          borderTopColor: '#ffffff',
          borderLeftColor: '#ffffff',
          borderRightColor: '#808080',
          borderBottomColor: '#808080',
          width: '480px',
          height: '400px',
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-2 py-1 text-white text-sm font-bold"
          style={{
            backgroundImage: 'linear-gradient(to right, #0054e3, #0b7bd8)',
            height: '24px',
          }}
        >
          <span>Folder Options</span>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center hover:bg-red-600 text-white font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <ToolbarsSection
            folderOptions={folderOptions}
            onToggle={handleToggle}
          />
          <ViewSection
            folderOptions={folderOptions}
            onViewTypeChange={handleViewTypeChange}
            onArrangeIconsChange={handleArrangeIconsChange}
          />
          <AdvancedSection
            folderOptions={folderOptions}
            onToggle={handleToggle}
          />
        </div>

        <DialogButtons
          onRestoreDefaults={handleRestoreDefaults}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default FolderOptionsDialog;
