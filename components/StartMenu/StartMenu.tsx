'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { setStartMenuOpen } from '@/lib/slices/startMenuSlice';
import StartMenuItem from './StartMenuItem';
import Divider from './Divider';
import AllProgramsButton from './AllProgramsButton';
import { tooltipTexts } from '../../lib/tooltips';

// Shared type for position
interface Position {
  left: number;
  top: number;
}

// Menu item type
interface MenuItem {
  type: 'item' | 'divider';
  title?: string;
  iconFileName?: string;
  textColor?: 'blue' | 'black';
  bold?: boolean;
  description?: string;
  position: Position;
  color?: 'black' | 'blue'; // Added for divider
  hasExpandArrow?: boolean; // Optional expand arrow for items
  fontSize?: number; // Optional font size, not used in this component but can be passed
}

const menuItems: MenuItem[] = [
  {
    type: 'item',
    title: 'Internet',
    iconFileName: 'Internet Explorer.png',
    textColor: 'black',
    bold: true,
    description: tooltipTexts.intenetExplorer,
    position: { left: 3, top: 85 },
    fontSize: 14, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'E-mail',
    iconFileName: 'Email.png',
    textColor: 'black',
    bold: true,
    description: tooltipTexts.email,
    position: { left: 3, top: 122 }, // 85 + 37
    fontSize: 14, // Default font size, can be adjusted
  },
  {
    type: 'divider',
    position: { left: 3, top: 159 }, // 122 + 37
    color: 'black',
  },
  {
    type: 'item',
    title: 'Windows Media Player',
    iconFileName: 'Windows Media Player 10.png',
    textColor: 'black',
    description: tooltipTexts.mediaPlayer,
    position: { left: 3, top: 176 }, // 159 + 17
    fontSize: 14, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'Windows Messenger',
    iconFileName: 'Windows Messenger.png',
    textColor: 'black',
    description: tooltipTexts.messenger,
    position: { left: 3, top: 213 }, // 176 + 37
    fontSize: 14, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'Tour Windows XP',
    iconFileName: 'Tour XP.png',
    textColor: 'black',
    description: tooltipTexts.tourXP,
    position: { left: 3, top: 250 }, // 213 + 37
    fontSize: 14, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'File and Settings Transfer Wizard',
    iconFileName: 'File and Settings Transfer Wizard.png',
    textColor: 'black',
    description: tooltipTexts.filesAndSettingsTransferWizard,
    position: { left: 3, top: 287 }, // 250 + 37
    fontSize: 14, // Default font size, can be adjusted
  },
  {
    type: 'divider',
    position: { left: 3, top: 470 }, // 287 + 183 (to match original gap)
    color: 'black',
  },
  {
    type: 'item',
    title: 'My Documents',
    iconFileName: 'My Documents.png',
    textColor: 'blue',
    position: { left: 252, top: 85 },
    bold: true,
    description: tooltipTexts.myDocuments,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'My Recent Documents',
    iconFileName: 'Recent Documents.png',
    textColor: 'blue',
    position: { left: 252, top: 120 }, // 85 + 37
    bold: true,
    hasExpandArrow: true,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'My Pictures',
    iconFileName: 'My Pictures.png',
    textColor: 'blue',
    position: { left: 252, top: 150 }, // 122 + 37
    bold: true,
    description: tooltipTexts.myPictures,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'My Music',
    iconFileName: 'My Music.png',
    textColor: 'blue',
    position: { left: 252, top: 180 }, // 159 + 37
    bold: true,
    description: tooltipTexts.myMusic,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'My Computer',
    iconFileName: 'My Computer.png',
    textColor: 'blue',
    position: { left: 252, top: 210 }, // 196 + 37
    bold: true,
    description: tooltipTexts.myComputer,
    fontSize: 13, // Default font size, can be adjusted
  },
  { type: 'divider', position: { left: 252, top: 240 }, color: 'blue' }, // 233 + 37
  {
    type: 'item',
    title: 'Control Panel',
    iconFileName: 'Control Panel.png',
    position: { left: 252, top: 258 }, // 270 + 17
    textColor: 'blue',
    description: tooltipTexts.controlPanel,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'Set Program Access and Defaults',
    iconFileName: 'Default Programs.png',
    position: { left: 252, top: 288 }, // 287 + 37
    textColor: 'blue',
    description: tooltipTexts.programsAccess,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'Printer and Faxes',
    iconFileName: 'Printers and Faxes.png',
    position: { left: 252, top: 318 }, // 324 + 37
    textColor: 'blue',
    description: tooltipTexts.printersAndFaxes,
    fontSize: 13, // Default font size, can be adjusted
  },
  { type: 'divider', position: { left: 252, top: 348 }, color: 'blue' }, // 361 + 37
  {
    type: 'item',
    title: 'Help and Support',
    iconFileName: 'Help and Support.png',
    position: { left: 252, top: 366 }, // 398 + 17
    textColor: 'blue',
    description: tooltipTexts.helpAndSupport,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'Search',
    iconFileName: 'Search.png',
    position: { left: 252, top: 396 }, // 415 + 37
    textColor: 'blue',
    description: tooltipTexts.search,
    fontSize: 13, // Default font size, can be adjusted
  },
  {
    type: 'item',
    title: 'Run',
    iconFileName: 'Run.png',
    position: { left: 252, top: 426 }, // 452 + 37
    textColor: 'blue',
    description: tooltipTexts.run,
    fontSize: 13, // Default font size, can be adjusted
  },
];

const StartMenu: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.startMenu);

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-10 left-0 shadow-2xl z-40"
      style={{
        height: '600px',
        width: '500px',
        backgroundImage: 'url(/menu.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {menuItems.map((item, idx) =>
        item.type === 'divider' ? (
          <Divider
            key={idx}
            color={item.color === 'blue' ? 'blue' : 'gray'} // Map 'black' to 'gray' for Divider
            position={item.position}
          />
        ) : (
          <StartMenuItem
            key={item.title}
            title={item.title!}
            textColor={item.textColor || 'black'}
            iconFileName={item.iconFileName!}
            position={item.position}
            bold={item.bold}
            description={item.description}
            onClick={() => dispatch(setStartMenuOpen(false))}
            hasExpandArrow={item.hasExpandArrow}
            fontSize={item.fontSize || 14} // Default font size, can be adjusted
          />
        )
      )}
      <AllProgramsButton position={{ left: 3, top: 505 }} />
    </div>
  );
};

export default StartMenu;
