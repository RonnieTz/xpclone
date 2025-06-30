import React from 'react';
import { FolderOptions as FolderOptionsType } from '@/lib/slices/folderOptionsSlice';

interface AdvancedSectionProps {
  folderOptions: FolderOptionsType;
  onToggle: (key: keyof FolderOptionsType, value: boolean) => void;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({
  folderOptions,
  onToggle,
}) => (
  <fieldset className="border border-gray-400 p-3 mb-4">
    <legend className="px-2 text-sm font-bold">Advanced</legend>
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={folderOptions.showHiddenFiles}
          onChange={(e) => onToggle('showHiddenFiles', e.target.checked)}
        />
        <span>Show hidden files and folders</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={folderOptions.showFileExtensions}
          onChange={(e) => onToggle('showFileExtensions', e.target.checked)}
        />
        <span>Show file extensions</span>
      </label>
    </div>
  </fieldset>
);
