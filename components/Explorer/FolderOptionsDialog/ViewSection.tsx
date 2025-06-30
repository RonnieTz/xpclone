import React from 'react';
import { FolderOptions as FolderOptionsType } from '@/lib/slices/folderOptionsSlice';

interface ViewSectionProps {
  folderOptions: FolderOptionsType;
  onViewTypeChange: (viewType: FolderOptionsType['viewType']) => void;
  onArrangeIconsChange: (
    arrangeBy: FolderOptionsType['arrangeIconsBy']
  ) => void;
}

export const ViewSection: React.FC<ViewSectionProps> = ({
  folderOptions,
  onViewTypeChange,
  onArrangeIconsChange,
}) => (
  <fieldset className="border border-gray-400 p-3 mb-4">
    <legend className="px-2 text-sm font-bold">View</legend>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold mb-2">View Type:</label>
        <div className="space-y-1">
          {(['tiles', 'icons', 'list', 'details', 'thumbnails'] as const).map(
            (type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="viewType"
                  checked={folderOptions.viewType === type}
                  onChange={() => onViewTypeChange(type)}
                />
                <span className="capitalize">{type}</span>
              </label>
            )
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">
          Arrange Icons By:
        </label>
        <div className="space-y-1">
          {(['name', 'size', 'type', 'modified'] as const).map((arrange) => (
            <label key={arrange} className="flex items-center space-x-2">
              <input
                type="radio"
                name="arrangeIcons"
                checked={folderOptions.arrangeIconsBy === arrange}
                onChange={() => onArrangeIconsChange(arrange)}
              />
              <span className="capitalize">{arrange}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </fieldset>
);
