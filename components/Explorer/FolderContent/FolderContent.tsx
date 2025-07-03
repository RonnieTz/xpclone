'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removePendingFolderPosition } from '@/lib/slices/pendingPositionsSlice';
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
  currentPath,
}) => {
  const dispatch = useDispatch();

  // Get pending folder positions from Redux
  const pendingFolderPositions = useSelector(
    (state: RootState) => state.pendingPositions.folderPositions
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemPositions]); // Remove localPositions to prevent infinite loops

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
      const newPositions = new Map(localPositions); // Start with existing positions
      let hasNewPositions = false;

      // Normalize the current path for consistent matching (handle undefined case)
      const normalizedCurrentPath = normalizeFolderPath(currentPath || '');

      // Get pending folder positions from Redux instead of sessionStorage
      const allPendingFolderPositions = Object.entries(pendingFolderPositions)
        .filter(([, data]) => {
          const typedData = data as {
            folderPath: string;
            fileId: string;
            fileName: string;
            x: number;
            y: number;
          };
          const normalizedDataPath = normalizeFolderPath(typedData.folderPath);
          return normalizedDataPath === normalizedCurrentPath;
        })
        .map(([folderKey, data]) => ({
          key: folderKey,
          data: data as {
            folderPath: string;
            fileId: string;
            fileName: string;
            x: number;
            y: number;
          },
        }));

      files.forEach((file, index) => {
        // Check if this file already has a position
        const hasExistingPosition = newPositions.has(file.id);

        if (hasExistingPosition) {
          return; // Skip files that already have positions
        }

        // Check if there's a pending position for this file
        let appliedPendingPosition = false;
        for (const {
          key: folderKey,
          data: pendingPos,
        } of allPendingFolderPositions) {
          const fileIdMatch = file.id === pendingPos.fileId;
          const fileNameMatch = file.name === pendingPos.fileName;

          if (fileIdMatch || fileNameMatch) {
            newPositions.set(file.id, { x: pendingPos.x, y: pendingPos.y });
            hasNewPositions = true;
            appliedPendingPosition = true;

            // Save to Redux via parent callback
            onFileMove?.(file.id, pendingPos.x, pendingPos.y);

            // Clear this pending position from Redux
            dispatch(removePendingFolderPosition(folderKey));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    files,
    viewMode,
    currentPath,
    pendingFolderPositions,
    dispatch,
    calculateDefaultPosition,
    normalizeFolderPath,
    onFileMove,
  ]); // Remove localPositions to prevent infinite loops

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
      data-drop-target="folder"
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
              // Add props for unified drag and drop system
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
