import React from 'react';
import { MenuType } from './types';

export const menuItems: MenuType[] = [
  'File',
  'Edit',
  'View',
  'Favorites',
  'Tools',
  'Help',
];

export const getDropdownItems = (menuType: MenuType): React.ReactNode => {
  switch (menuType) {
    case 'File':
      return (
        <div className="py-1">
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            New
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Open
          </div>
          <div className="border-t my-1"></div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Close
          </div>
        </div>
      );
    case 'Edit':
      return (
        <div className="py-1">
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Cut
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Copy
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Paste
          </div>
        </div>
      );
    case 'View':
      return (
        <div className="py-1">
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Large Icons
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Small Icons
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            List
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Details
          </div>
        </div>
      );
    case 'Favorites':
      return (
        <div className="py-1">
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Add to Favorites
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Organize Favorites
          </div>
        </div>
      );
    case 'Tools':
      return (
        <div className="py-1">
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Folder Options
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Internet Options
          </div>
        </div>
      );
    case 'Help':
      return (
        <div className="py-1">
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            Help Topics
          </div>
          <div className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm">
            About
          </div>
        </div>
      );
    default:
      return null;
  }
};
