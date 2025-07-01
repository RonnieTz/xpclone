'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { WindowState } from '@/lib/slices/windowsSlice';
import { useTaskbarSync } from './hooks/useTaskbarSync';
import { useGlobalClickHandler } from './hooks/useGlobalClickHandler';
import Desktop from './Desktop/Desktop';
import Taskbar from './Taskbar/Taskbar';
import StartMenu from './StartMenu/StartMenu';
import Window from './Window/Window';

const WindowsXP: React.FC = () => {
  const { windows } = useSelector((state: RootState) => state.windows);

  // Use custom hooks for logic separation
  useTaskbarSync();
  const { handleGlobalClick } = useGlobalClickHandler();

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      onClick={handleGlobalClick}
    >
      {/* Desktop area that clips content above taskbar */}
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden"
        style={{ height: 'calc(100vh - 40px)' }}
      >
        {/* Desktop with icons */}
        <Desktop />

        {/* Windows */}
        {windows.map((window: WindowState) => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      {/* Start Menu */}
      <div data-start-menu>
        <StartMenu />
      </div>

      {/* Taskbar - always on top */}
      <Taskbar />
    </div>
  );
};

export default WindowsXP;
