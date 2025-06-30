import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExplorerBarState } from '../../types';
import {
  toggleAddressBar,
  toggleStandardBar,
} from '@/lib/slices/folderOptionsSlice';
import { RootState } from '@/lib/store';
import DropdownItem from '../../Common/DropdownItem';
import DropdownDivider from '../../Common/DropdownDivider';
import { Submenu } from '../menuHelpers';

// View menu items
export const ViewMenuItems: React.FC<{
  windowId?: string;
  onClose?: () => void;
  explorerBarState?: ExplorerBarState;
  onExplorerBarStateChange?: (state: ExplorerBarState) => void;
}> = ({ onClose, explorerBarState, onExplorerBarStateChange }) => {
  const dispatch = useDispatch();
  const folderOptions = useSelector(
    (state: RootState) => state.folderOptions.options
  );

  const handleToggleStandardButtons = () => {
    dispatch(toggleStandardBar());
    onClose?.();
  };

  const handleToggleAddressBar = () => {
    dispatch(toggleAddressBar());
    onClose?.();
  };

  const handleExplorerBarStateChange = (state: ExplorerBarState) => {
    if (explorerBarState === state) {
      onExplorerBarStateChange?.('Default');
    } else {
      onExplorerBarStateChange?.(state);
    }
    onClose?.();
  };

  return (
    <>
      <DropdownItem text="Toolbars" expandArrow={true}>
        <Submenu>
          <DropdownItem
            text="Standard Buttons"
            tick={folderOptions.showStandardBar}
            onClick={handleToggleStandardButtons}
          />
          <DropdownItem
            text="Address Bar"
            tick={folderOptions.showAddressBar}
            onClick={handleToggleAddressBar}
          />
          <DropdownItem text="Links" tick={false} onClick={onClose} />
          <DropdownDivider />
          <DropdownItem text="Lock the Toolbars" onClick={onClose} />
          <DropdownItem text="Customize..." tick={false} onClick={onClose} />
        </Submenu>
      </DropdownItem>
      <DropdownItem text="Status Bar" tick={true} onClick={onClose} />
      <DropdownItem text="Explorer Bar" expandArrow={true}>
        <Submenu>
          <DropdownItem
            text="Search"
            secondaryText="Ctrl+E"
            tick={explorerBarState === 'Search'}
            onClick={() => handleExplorerBarStateChange('Search')}
          />
          <DropdownItem
            text="Favorites"
            secondaryText="Ctrl+I"
            tick={explorerBarState === 'Favorites'}
            onClick={() => handleExplorerBarStateChange('Favorites')}
          />
          <DropdownItem
            text="History"
            secondaryText="Ctrl+H"
            tick={explorerBarState === 'History'}
            onClick={() => handleExplorerBarStateChange('History')}
          />
          <DropdownItem
            text="Folders"
            tick={explorerBarState === 'Folders'}
            onClick={() => handleExplorerBarStateChange('Folders')}
          />
          <DropdownDivider />
          <DropdownItem text="Tip of the Day" onClick={onClose} />
        </Submenu>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem text="Thumbnails" dot={false} onClick={onClose} />
      <DropdownItem text="Tiles" dot={false} onClick={onClose} />
      <DropdownItem text="Icons" dot={false} onClick={onClose} />
      <DropdownItem text="List" dot={false} onClick={onClose} />
      <DropdownItem text="Details" dot={true} onClick={onClose} />
      <DropdownDivider />
      <DropdownItem text="Arrange Icons by" expandArrow={true}>
        <Submenu>
          <DropdownItem text="Name" dot onClick={onClose} />
          <DropdownItem text="Type" onClick={onClose} />
          <DropdownItem text="Size" onClick={onClose} />
          <DropdownItem text="Modified" onClick={onClose} />
          <DropdownDivider />
          <DropdownItem text="Show in Groups" tick onClick={onClose} />
          <DropdownItem text="Auto Arrange" tick onClick={onClose} />
          <DropdownItem text="Align to Grid" onClick={onClose} />
        </Submenu>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem text="Choose Details..." onClick={onClose} />
      <DropdownItem text="Go To" expandArrow={true}>
        <Submenu>
          <DropdownItem
            text="Back"
            secondaryText="Alt+Left Arrow"
            onClick={onClose}
          />
          <DropdownItem
            text="Forward"
            secondaryText="Alt+Right Arrow"
            onClick={onClose}
          />
          <DropdownItem text="Up One Level" onClick={onClose} />
          <DropdownDivider />
          <DropdownItem
            text="Home Page"
            secondaryText="Alt+Home"
            onClick={onClose}
          />
          <DropdownDivider />
          <DropdownItem text="My Computer" onClick={onClose} />
        </Submenu>
      </DropdownItem>
      <DropdownItem text="Refresh" secondaryText="F5" onClick={onClose} />
    </>
  );
};
