'use client';

import React from 'react';
import { FolderContentProps, FileItem } from './types';
import UnifiedItem from '@/components/Common/Item';
import { convertFileItemToUnified } from '@/components/Common/Item/utils';
import EmptyFolderState from './EmptyFolderState';
import { getFileGridClasses, getFileGridStyles } from './layout';
import { useFilePositions } from './useFilePositions';

const FolderContent: React.FC<FolderContentProps> = ({
  files = [],
  viewMode = 'icons',
  onFileDoubleClick,
  onFileSelect,
  onBackgroundClick,
  selectedFileIds = [],
  windowId,
  onFileMove,
  itemPositions,
  currentPath,
}) => {
  const { localPositions, handleFileMove } = useFilePositions({
    files,
    viewMode,
    currentPath,
    itemPositions,
    onFileMove,
  });

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only handle clicks on the background (not on file items)
    if (e.target === e.currentTarget) {
      // Call the callback to clear selections
      onBackgroundClick?.();
    }
  };

  return (
    <div
      className="w-full h-full overflow-auto p-2"
      onClick={handleBackgroundClick}
      data-folder-content={windowId}
      data-folder-path={currentPath}
      data-drop-target="folder"
    >
      {files.length === 0 ? (
        <EmptyFolderState />
      ) : (
        <div
          className={getFileGridClasses(viewMode, localPositions.size > 0)}
          style={getFileGridStyles(viewMode)}
          onClick={handleBackgroundClick}
        >
          {files.map((file: FileItem) => (
            <UnifiedItem
              key={file.id}
              item={convertFileItemToUnified(file)}
              context="folder"
              viewMode={viewMode}
              isSelected={selectedFileIds.includes(file.id)}
              onSelect={(event?: React.MouseEvent) =>
                onFileSelect?.(file, event)
              }
              onDoubleClick={() => onFileDoubleClick?.(file)}
              onMove={
                viewMode === 'icons'
                  ? (x: number, y: number) => handleFileMove(file.id, x, y)
                  : undefined
              }
              position={
                viewMode === 'icons' ? localPositions.get(file.id) : undefined
              }
              currentPath={currentPath}
              windowId={windowId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderContent;
