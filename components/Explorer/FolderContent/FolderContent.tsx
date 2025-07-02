'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FolderContentProps, FileItem } from './types';
import UnifiedItem from '@/components/Common/Item';
import { convertFileItemToUnified } from '@/components/Common/Item/utils';

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
  currentPath, // Add currentPath prop
}) => {
  // Convert Redux positions Record to Map for internal use
  const [localPositions, setLocalPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());

  // Sync Redux positions to local Map when itemPositions changes
  useEffect(() => {
    if (itemPositions) {
      const newMap = new Map(Object.entries(itemPositions));
      // Only update if the positions are actually different to prevent loops
      if (
        localPositions.size !== newMap.size ||
        !Array.from(newMap.entries()).every(([key, value]) => {
          const existing = localPositions.get(key);
          return existing && existing.x === value.x && existing.y === value.y;
        })
      ) {
        setLocalPositions(newMap);
      }
    }
  }, [itemPositions]); // Remove localPositions from dependencies to prevent loop

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

  // Normalize folder paths to ensure consistent matching
  const normalizeFolderPath = useCallback((path: string) => {
    if (!path) return '';
    // Remove trailing slashes and normalize backslashes
    return path
      .replace(/[\\\/]+$/, '')
      .replace(/\//g, '\\')
      .trim();
  }, []);

  // Initialize positions for items that don't have custom positions
  useEffect(() => {
    if (viewMode === 'icons' && files.length > 0) {
      // Only run if we actually have files and no positions set yet
      const hasAnyPositions = localPositions.size > 0;
      if (hasAnyPositions) return; // Skip if we already have positions

      const newPositions = new Map();
      let hasNewPositions = false;

      // Normalize the current path for consistent matching (handle undefined case)
      const normalizedCurrentPath = normalizeFolderPath(currentPath || '');

      // Check for pending folder positions first (from desktop-to-folder drops)
      const allPendingFolderPositions: Array<{
        key: string;
        data: {
          fileId: string;
          fileName: string;
          folderPath: string;
          x: number;
          y: number;
        };
      }> = [];
      if (typeof window !== 'undefined' && normalizedCurrentPath) {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('pendingFolderPosition_')) {
            const dataStr = sessionStorage.getItem(key);
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                // Normalize both paths for comparison
                const normalizedDataPath = normalizeFolderPath(data.folderPath);
                if (normalizedDataPath === normalizedCurrentPath) {
                  allPendingFolderPositions.push({ key, data });
                }
              } catch (e) {
                console.warn(
                  'Failed to parse pending folder position:',
                  key,
                  e
                );
              }
            }
          }
        }
      }

      files.forEach((file, index) => {
        // First check if there's a pending position for this file
        let appliedPendingPosition = false;
        for (const { key, data: pendingPos } of allPendingFolderPositions) {
          const fileIdMatch = file.id === pendingPos.fileId;
          const fileNameMatch = file.name === pendingPos.fileName;

          if (fileIdMatch || fileNameMatch) {
            newPositions.set(file.id, { x: pendingPos.x, y: pendingPos.y });
            hasNewPositions = true;
            appliedPendingPosition = true;

            // Save to Redux via parent callback
            onFileMove?.(file.id, pendingPos.x, pendingPos.y);

            // Clear this pending position
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem(key);
            }
            break;
          }
        }

        // If no pending position was applied, use default
        if (!appliedPendingPosition) {
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
  }, [
    files,
    viewMode,
    currentPath,
    // Remove callbacks from dependencies to prevent re-runs
  ]);

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
      data-folder-content={windowId}
      data-folder-path={currentPath}
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
