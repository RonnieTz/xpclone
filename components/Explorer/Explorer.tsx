'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import ExplorerToolbar from './Toolbar/ExplorerToolbar';
import StandardButtonsToolbar from './StandardButtons/StandardButtonsToolbar';
import AddressBar from './AddressBar/AddressBar';
import ExplorerBar from './ExplorerBar/ExplorerBar';
import FolderContent, { ViewMode } from './FolderContent';
import { ExplorerProps, ExplorerBarState } from './types';
import { useExplorerNavigation } from './hooks/useExplorerNavigation';
import { useFileSelection } from './hooks/useFileSelection';
import { useFileOperations } from './hooks/useFileOperations';

const Explorer: React.FC<ExplorerProps> = ({ path, windowId }) => {
  const explorerRef = useRef<HTMLDivElement>(null);
  const [viewMode] = useState<ViewMode>('icons');
  const [explorerBarState, setExplorerBarState] =
    useState<ExplorerBarState>('Default');

  const folderOptions = useSelector(
    (state: RootState) => state.folderOptions.options
  );

  // Get persistent positions for current folder from Redux
  const { currentPath, files, handlePathChange, loadFilesForPath } =
    useExplorerNavigation({
      initialPath: path,
      windowId,
    });

  const persistentPositions = useSelector(
    (state: RootState) =>
      state.folderPositions.folderPositions[currentPath] || {}
  );

  // Get the current window to watch for focus changes
  const currentWindow = useSelector((state: RootState) =>
    windowId ? state.windows.windows.find((w) => w.id === windowId) : null
  );

  const {
    selectedFileIds,
    handleFileSelect,
    handleBackgroundClick,
    clearSelection,
  } = useFileSelection(files);

  const { handleFileDoubleClick, handleFileMove } = useFileOperations({
    currentPath,
    onPathChange: handlePathChange,
    clearSelection,
  });

  // Watch for refresh counter changes to reload files
  useEffect(() => {
    if (currentWindow?.refreshCounter) {
      loadFilesForPath(currentPath);
    }
  }, [currentWindow?.refreshCounter, loadFilesForPath, currentPath]);

  // Clear file selections when window loses focus
  useEffect(() => {
    if (
      currentWindow &&
      !currentWindow.isActive &&
      selectedFileIds.length > 0
    ) {
      clearSelection();
    }
  }, [currentWindow?.isActive, selectedFileIds.length, clearSelection]);

  // Clear selection when changing paths
  useEffect(() => {
    clearSelection();
  }, [currentPath, clearSelection]);

  return (
    <div ref={explorerRef} className="w-full h-full bg-white flex flex-col">
      <ExplorerToolbar
        windowId={windowId}
        explorerBarState={explorerBarState}
        onExplorerBarStateChange={setExplorerBarState}
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
