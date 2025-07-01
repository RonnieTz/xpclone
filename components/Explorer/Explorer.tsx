'use client';

import React from 'react';
import ExplorerToolbar from './Toolbar/ExplorerToolbar';
import StandardButtonsToolbar from './StandardButtons/StandardButtonsToolbar';
import AddressBar from './AddressBar/AddressBar';
import ExplorerBar from './ExplorerBar/ExplorerBar';
import FolderContent from './FolderContent';
import { ExplorerProps } from './types';
import { useExplorer } from './hooks';

const Explorer: React.FC<ExplorerProps> = ({ path, windowId }) => {
  const {
    explorerRef,
    viewMode,
    explorerBarState,
    setExplorerBarState,
    folderOptions,
    persistentPositions,
    currentPath,
    files,
    handlePathChange,
    selectedFileIds,
    handleFileSelect,
    handleBackgroundClick,
    selectAll,
    handleFileDoubleClick,
    handleFileMove,
  } = useExplorer({ path, windowId });

  return (
    <div ref={explorerRef} className="w-full h-full bg-white flex flex-col">
      <ExplorerToolbar
        windowId={windowId}
        explorerBarState={explorerBarState}
        onExplorerBarStateChange={setExplorerBarState}
        onSelectAll={selectAll}
      />
      {folderOptions.showStandardBar && (
        <StandardButtonsToolbar
          windowId={windowId}
          currentPath={currentPath}
          onNavigate={handlePathChange}
        />
      )}
      {folderOptions.showAddressBar && (
        <AddressBar currentPath={currentPath} onPathChange={handlePathChange} />
      )}

      {/* Main content area with explorer bar and content */}
      <div className="flex-1 flex">
        {/* Explorer Bar (Sidebar) */}
        <ExplorerBar currentState={explorerBarState} />

        {/* Main Content Area */}
        <div className="flex-1 bg-white relative">
          <FolderContent
            files={files}
            viewMode={viewMode}
            onFileDoubleClick={handleFileDoubleClick}
            onFileSelect={handleFileSelect}
            onBackgroundClick={handleBackgroundClick}
            selectedFileIds={selectedFileIds}
            windowId={windowId}
            onFileMove={handleFileMove}
            itemPositions={persistentPositions}
          />
        </div>
      </div>
    </div>
  );
};

export default Explorer;
