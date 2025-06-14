'use client';

import React from 'react';
import Clock from './Clock';

const SystemTray: React.FC = () => {
  return (
    <div className="flex items-center h-full relative">
      <Clock />
    </div>
  );
};

export default SystemTray;
