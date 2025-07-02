'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FolderContentProps, FileItem } from './types';
import UnifiedItem from '@/components/Common/UnifiedItem';
import { convertFileItemToUnified } from '@/components/Common/UnifiedItem/utils';

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
}) => {
  // Convert Redux positions Record to Map for internal use
  const [localPositions, setLocalPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());

  // Sync Redux positions to local Map when itemPositions changes
  useEffect(() => {
    if (itemPositions) {
      setLocalPositions(new Map(Object.entries(itemPositions)));
    }
  }, [itemPositions]);

  // Calculate default grid positions for items that don't have custom positions
  const calculateDefaultPosition = useCallback((index: number) => {
    const itemWidth = 80;
    const itemHeight = 80;
    const padding = 8;
    const itemsPerRow = Math.floor(
      (window.innerWidth - 300) / (itemWidth + padding)
    ); // Account for sidebar

    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;

    return {
      x: col * (itemWidth + padding) + padding,
      y: row * (itemHeight + padding) + padding,
    };
  }, []);

  // Initialize positions for items that don't have custom positions
  useEffect(() => {
    if (viewMode === 'icons') {
      const newPositions = new Map(localPositions);
      let hasNewPositions = false;

      files.forEach((file, index) => {
        if (!newPositions.has(file.id)) {
          const defaultPos = calculateDefaultPosition(index);
          newPositions.set(file.id, defaultPos);
          hasNewPositions = true;

          // Save new default position to Redux via parent callback
          onFileMove?.(file.id, defaultPos.x, defaultPos.y);
        }
      });

      if (hasNewPositions) {
        setLocalPositions(newPositions);
      }
    }
  }, [files, viewMode, localPositions, calculateDefaultPosition, onFileMove]);

  const handleFileMove = (fileId: string, x: number, y: number) => {
    const newPositions = new Map(localPositions);
    newPositions.set(fileId, { x, y });
    setLocalPositions(newPositions);

    // Call the parent callback to save to Redux
    onFileMove?.(fileId, x, y);
  };

  const getFileGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'flex flex-col';
      case 'details':
        return 'flex flex-col';
      case 'thumbnails':
        return 'grid gap-3';
      case 'icons':
      default:
        // Use relative positioning container for absolute positioned items when dragging is enabled
        if (localPositions.size > 0) {
          return 'relative w-full h-full';
        }
        return 'flex flex-row flex-wrap gap-0 items-start content-start';
    }
  };

  const getFileGridStyles = () => {
    if (viewMode === 'thumbnails') {
      return {
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gridAutoFlow: 'row',
      };
    }
    return {};
  };

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
    >
      {files.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 text-center mt-8">
            This folder is empty.
          </p>
        </div>
      ) : (
        <div
          className={getFileGridClasses()}
          style={getFileGridStyles()}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderContent;
