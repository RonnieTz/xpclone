'use client';

import React, { useRef } from 'react';
import ExplorerToolbar from './ExplorerToolbar';
import { ExplorerProps } from './types';

const Explorer: React.FC<ExplorerProps> = () => {
  const explorerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={explorerRef} className="w-full h-full bg-white flex flex-col">
      <ExplorerToolbar />
      {/* TODO: Add main content area here */}
    </div>
  );
};

export default Explorer;
