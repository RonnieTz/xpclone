import React from 'react';
import { FolderOptions as FolderOptionsType } from '@/lib/slices/folderOptionsSlice';

interface ToolbarsSectionProps {
  folderOptions: FolderOptionsType;
  onToggle: (key: keyof FolderOptionsType, value: boolean) => void;
}

export const ToolbarsSection: React.FC<ToolbarsSectionProps> = ({
  folderOptions,
  onToggle,
}) => (
  <fieldset className="border border-gray-400 p-3 mb-4">
    <legend className="px-2 text-sm font-bold">Toolbars</legend>
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={folderOptions.showStandardBar}
          onChange={(e) => onToggle('showStandardBar', e.target.checked)}
        />
        <span>Standard Buttons</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={folderOptions.showAddressBar}
          onChange={(e) => onToggle('showAddressBar', e.target.checked)}
        />
        <span>Address Bar</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={folderOptions.showStatusBar}
          onChange={(e) => onToggle('showStatusBar', e.target.checked)}
        />
        <span>Status Bar</span>
      </label>
    </div>
  </fieldset>
);
