import React from 'react';
import { MenuType, ExplorerBarState } from '../types';
import { MENU_WIDTHS } from './menuConstants';
import { MenuContainer } from './menuHelpers';
import {
  FileMenuItems,
  EditMenuItems,
  ViewMenuItems,
  FavoritesMenuItems,
  ToolsMenuItems,
  HelpMenuItems,
} from './menus';

export { menuItems } from './menuConstants';

// Menu configuration
const menuConfig = {
  File: { width: MENU_WIDTHS.WIDE, component: FileMenuItems },
  Edit: { width: MENU_WIDTHS.DEFAULT, component: EditMenuItems },
  View: { width: MENU_WIDTHS.WIDE, component: ViewMenuItems },
  Favorites: { width: MENU_WIDTHS.DEFAULT, component: FavoritesMenuItems },
  Tools: { width: MENU_WIDTHS.DEFAULT, component: ToolsMenuItems },
  Help: { width: MENU_WIDTHS.NARROW, component: HelpMenuItems },
} as const;

export const getDropdownItems = (
  menuType: MenuType,
  windowId?: string,
  onClose?: () => void,
  explorerBarState?: ExplorerBarState,
  onExplorerBarStateChange?: (state: ExplorerBarState) => void,
  onSelectAll?: () => void
) => {
  const config = menuConfig[menuType];
  if (!config) return null;

  const MenuComponent = config.component;

  return (
    <MenuContainer width={config.width}>
      <MenuComponent
        windowId={windowId}
        onClose={onClose}
        explorerBarState={explorerBarState}
        onExplorerBarStateChange={onExplorerBarStateChange}
        onSelectAll={onSelectAll}
      />
    </MenuContainer>
  );
};
