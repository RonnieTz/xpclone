import React from 'react';
import { WindowState } from '@/lib/slices/windowsSlice';
import Explorer from '../Explorer/Explorer';

interface WindowContentProps {
  window: WindowState;
}

const WindowContent: React.FC<WindowContentProps> = ({ window }) => {
  // Check if this window should show the Explorer
  const shouldShowExplorer = () => {
    // Check for folder windows
    if (
      window.content.includes('Folder:') ||
      window.content.includes('My Computer') ||
      window.content.includes('Recycle Bin')
    ) {
      return true;
    }
    return false;
  };

  const getExplorerType = (): 'folder' | 'my-computer' | 'recycle-bin' => {
    if (window.content.includes('My Computer')) return 'my-computer';
    if (window.content.includes('Recycle Bin')) return 'recycle-bin';
    return 'folder';
  };

  const getExplorerPath = (): string => {
    if (window.content.includes('Folder:')) {
      // Extract path from content like "Folder: C:\Path"
      const match = window.content.match(/Folder:\s*(.+)/);
      return match ? match[1] : 'C:\\';
    }
    if (window.content.includes('My Computer')) return 'My Computer';
    if (window.content.includes('Recycle Bin')) return 'Recycle Bin';
    return window.title;
  };

  if (shouldShowExplorer()) {
    return (
      <div
        className={`flex-1 overflow-hidden ${
          window.isMaximized ? '' : 'mx-0.5 mb-0.5'
        }`}
        style={{ height: 'calc(100% - 30px)' }}
      >
        <Explorer path={getExplorerPath()} type={getExplorerType()} />
      </div>
    );
  }

  // Default content for non-explorer windows
  return (
    <div
      className={`flex-1 overflow-hidden bg-green-100 ${
        window.isMaximized ? '' : 'mx-0.5 mb-0.5'
      }`}
      style={{ height: 'calc(100% - 30px)' }}
    >
      <div className="p-4">
        <div className="text-sm">{window.content}</div>
      </div>
    </div>
  );
};

export default WindowContent;
