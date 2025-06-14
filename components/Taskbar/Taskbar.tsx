'use client';

import React from 'react';
import StartButton from './StartButton';
import TaskbarItems from './TaskbarItems';
import SystemTray from './SystemTray';

const Taskbar: React.FC = () => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-10 flex items-center z-50"
      style={{
        backgroundImage: 'url(/taskbar-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <StartButton />
      <TaskbarItems />
      <SystemTray />
    </div>
  );
};

export default Taskbar;
