import { MenuType } from '../types';

// Constants
export const MENU_WIDTHS = {
  DEFAULT: '180px',
  WIDE: '200px',
  NARROW: '160px',
} as const;

export const SUBMENU_POSITION = { x: 198, y: 0 } as const;

export const menuItems: MenuType[] = [
  'File',
  'Edit',
  'View',
  'Favorites',
  'Tools',
  'Help',
];
