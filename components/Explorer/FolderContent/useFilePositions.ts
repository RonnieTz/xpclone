import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removePendingFolderPosition } from '@/lib/slices/pendingPositionsSlice';
import { FileItem } from './types';
import { calculateDefaultPosition, normalizeFolderPath } from './utils';

export interface UseFilePositionsProps {
  files: FileItem[];
  viewMode: string;
  currentPath?: string;
  itemPositions?: Record<string, { x: number; y: number }>;
  onFileMove?: (fileId: string, x: number, y: number) => void;
}

export const useFilePositions = ({
  files,
  viewMode,
  currentPath,
  itemPositions,
  onFileMove,
}: UseFilePositionsProps) => {
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
    onFileMove,
  ]); // Remove localPositions to prevent infinite loops

  const handleFileMove = useCallback(
    (fileId: string, x: number, y: number) => {
      const newPositions = new Map(localPositions);
      newPositions.set(fileId, { x, y });
      setLocalPositions(newPositions);

      // Call the parent callback to save to Redux
      onFileMove?.(fileId, x, y);
    },
    [localPositions, onFileMove]
  );

  return {
    localPositions,
    handleFileMove,
  };
};
