'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useSubmenuContext } from './SubmenuContext';
import { tooltipTexts } from '../../lib/tooltips';

// Create a mapping between program menu item names and tooltip texts
const programTooltipMapping: { [key: string]: string } = {
  'Set Program Access and Defaults': tooltipTexts.programsAccess,
  'Windows Catalog': tooltipTexts.catalog,
  'Windows Update': tooltipTexts.windowsUpdate,
  'Internet Explorer': tooltipTexts.intenetExplorer,
  MSN: tooltipTexts.msn,
  'Outlook Express': tooltipTexts.email,
  'Remote Assistance': tooltipTexts.remoteAssistance,
  'Windows Media Player': tooltipTexts.windowsMediaPlayer,
  'Windows Messenger': tooltipTexts.messenger,
  'Windows Movie Maker': tooltipTexts.movieMaker,
  'Address Book': tooltipTexts.addressBook,
  Calculator: tooltipTexts.calculator,
  'Command Prompt': tooltipTexts.commandPromt,
  Notepad: tooltipTexts.notepad,
  Paint: tooltipTexts.paint,
  'Program Compatibility Wizard': tooltipTexts.programCompatibilityWizard,
  Ssynchronize: tooltipTexts.synchronize,
  'Tour Windows XP': tooltipTexts.tourXP,
  'Windows Explorer': tooltipTexts.windowsExplorer,
  Wordpad: tooltipTexts.wordpad,
  'Accessibility Wizard': tooltipTexts.accessibilityWizard,
  Magnifier: tooltipTexts.magnifier,
  Narrator: tooltipTexts.narrator,
  'On-Screen Keyboard': tooltipTexts.onScreenKeyboard,
  'Utility Manager': tooltipTexts.utilityManager,
  HyperTerminal: tooltipTexts.hyperTerminal,
  'Network Connections': tooltipTexts.nerworkConnections,
  'Network Setup Wizard': tooltipTexts.networkSetupWizard,
  'New Connection Wizard': tooltipTexts.newConnectionWizard,
  'Wireless Network Setup Wizard': tooltipTexts.wirelessNetworkSetupWizard,
  'Sound Recorder': tooltipTexts.soundRecorder,
  'Volume Control': tooltipTexts.volumeControl,
  Backup: tooltipTexts.backup,
  'Character Map': tooltipTexts.characterMap,
  'Disk Cleanup': tooltipTexts.diskCleanup,
  'Disk Defragmenter': tooltipTexts.diskDefragmenter,
  'Files and Settings Transfer Wizard':
    tooltipTexts.filesAndSettingsTransferWizard,
  'Scheduled Tasks': tooltipTexts.scheduledTasks,
  'Security Center': tooltipTexts.securityCenter,
  'System Information': tooltipTexts.systemInformation,
  'System Restore': tooltipTexts.systemRestore,
  FreeCell: tooltipTexts.freeCell,
  Hearts: tooltipTexts.hearts,
  Minesweeper: tooltipTexts.minesweeper,
  Pinball: tooltipTexts.pinball,
  'Spider Solitaire': tooltipTexts.spiderSolitaire,
  Solitaire: tooltipTexts.solitaire,
};

interface ProgramMenuItemProps {
  text: string;
  icon: string;
  expanded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  id?: string; // Add unique identifier for submenu management
}

const ProgramMenuItem: React.FC<ProgramMenuItemProps> = ({
  text,
  icon,
  expanded = false,
  onClick,
  children,
  id = text, // Default to text if no ID provided
}) => {
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { activeSubmenuId, setActiveSubmenu, hoveredItemId, setHoveredItem } =
    useSubmenuContext();

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // Check if this item's submenu should be visible
  const isSubmenuVisible = activeSubmenuId === id && children;

  // Get tooltip text for this item
  const tooltipText = programTooltipMapping[text];

  const clearTooltipTimeout = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  };

  const getTooltipPosition = (mouseX: number, mouseY: number) => {
    return {
      x: mouseX + 10,
      y: mouseY + 10,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setHoveredItem(text); // Set the hovered item ID

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set a timeout to show this submenu after 300ms
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(id);
    }, 300);

    // Handle tooltip
    if (tooltipText) {
      clearTooltipTimeout();

      const position = getTooltipPosition(e.clientX, e.clientY);
      setTooltipPosition(position);

      // Set a timeout to show tooltip after 1 second
      const timeout = setTimeout(() => {
        // Only show tooltip if not hovering over a submenu
        if (!isSubmenuVisible) {
          setShowTooltip(true);
        }
      }, 1000);

      tooltipTimeoutRef.current = timeout;
    }
  };

  const handleMouseLeave = () => {
    // setHoveredItem(null); // Clear the hovered item ID

    // Clear the timeout if mouse leaves before timeout completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Hide tooltip
    setShowTooltip(false);
    clearTooltipTimeout();
  };

  // Hide tooltip when submenu becomes visible
  useEffect(() => {
    if (isSubmenuVisible) {
      setShowTooltip(false);
      clearTooltipTimeout();
    }
  }, [isSubmenuVisible]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      clearTooltipTimeout();
    };
  }, []);

  // Tooltip component that renders to document body
  const tooltip =
    showTooltip && tooltipText && typeof document !== 'undefined'
      ? createPortal(
          <div
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              backgroundColor: 'white',
              border: '1px solid black',
              boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              fontFamily: 'Tahoma, Arial, Helvetica, sans-serif',
              fontSize: '11px',
              color: '#000',
              whiteSpace: 'nowrap',
              padding: '0 8px',
              zIndex: 2147483647,
              pointerEvents: 'none',
            }}
          >
            {tooltipText}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={itemRef}
        className="flex items-center pl-3 group"
        style={{
          height: '24px',
          width: '100%',
          backgroundColor: hoveredItemId === text ? '#316ac5' : 'transparent',
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Icon */}
        <Image
          src={icon}
          alt={text}
          width={16}
          height={16}
          className="mr-1.5"
          style={{
            filter:
              hoveredItemId === text
                ? 'none'
                : 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))',
          }}
        />

        {/* Text */}
        <div
          className="flex-1 min-w-0 text-xs select-none mr-8"
          style={{
            color: hoveredItemId === text ? '#fff' : '#000',
            fontFamily: 'Tahoma, Arial, Helvetica, sans-serif',
            textWrap: 'nowrap',
          }}
        >
          {text}
        </div>

        {/* Expand arrow (if expanded prop is true) */}
        {expanded && (
          <span className="ml-auto flex items-center h-full mr-1.5">
            <svg
              width="6"
              height="10"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <polygon
                points="2,2 8,8 2,14"
                fill={hoveredItemId === text ? '#fff' : '#222'}
              />
            </svg>
          </span>
        )}
        {/* Only render children when this submenu should be visible */}
        {children && isSubmenuVisible && children}
      </div>
      {tooltip}
    </>
  );
};

export default ProgramMenuItem;
