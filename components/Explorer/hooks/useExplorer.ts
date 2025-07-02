import { useRef, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useExplorerNavigation } from './useExplorerNavigation';
import { useExplorerSelectors } from './useExplorerSelectors';
import { useFileSelection } from './useFileSelection';
import { useFileOperations } from './useFileOperations';
import { useExplorerKeyboard } from './useExplorerKeyboard';
import { useExplorerEffects } from './useExplorerEffects';
import { ExplorerBarState } from '../types';
import { ViewMode } from '../FolderContent/types';

interface UseExplorerProps {
  path?: string;
  windowId?: string;
}

interface UseExplorerReturn {
  explorerRef: React.RefObject<HTMLDivElement | null>;
  viewMode: ViewMode;
  explorerBarState: ExplorerBarState;
  setExplorerBarState: React.Dispatch<React.SetStateAction<ExplorerBarState>>;
  folderOptions: ReturnType<
    typeof import('@/lib/store')['store']['getState']
  >['folderOptions']['options'];
  persistentPositions: Record<string, { x: number; y: number }>;
  currentPath: string;
  files: ReturnType<typeof useExplorerNavigation>['files'];
  handlePathChange: ReturnType<
    typeof useExplorerNavigation
  >['handlePathChange'];
  selectedFileIds: string[];
  handleFileSelect: ReturnType<typeof useFileSelection>['handleFileSelect'];
  handleBackgroundClick: ReturnType<
    typeof useFileSelection
  >['handleBackgroundClick'];
  selectAll: ReturnType<typeof useFileSelection>['selectAll'];
  handleFileDoubleClick: ReturnType<
    typeof useFileOperations
  >['handleFileDoubleClick'];
  handleFileMove: ReturnType<typeof useFileOperations>['handleFileMove'];
}

export const useExplorer = ({
  path,
  windowId,
}: UseExplorerProps): UseExplorerReturn => {
  const explorerRef = useRef<HTMLDivElement>(null);
  const [explorerBarState, setExplorerBarState] =
    useState<ExplorerBarState>('Default');
  const hasInitializedPositions = useRef(false); // Add flag to prevent re-initialization

  // Get view mode from folder options
  const folderOptionsViewType = useSelector(
    (state: RootState) => state.folderOptions.options.viewType
  );

  // Convert folder options view type to ViewMode (exclude 'tiles')
  const viewMode: ViewMode =
    folderOptionsViewType === 'tiles' ? 'icons' : folderOptionsViewType;

  // Navigation
  const { currentPath, files, handlePathChange, loadFilesForPath } =
    useExplorerNavigation({
      initialPath: path,
      windowId,
    });

  // Selectors (folder options and persistent positions)
  const { folderOptions, persistentPositions } = useExplorerSelectors(
    currentPath,
    windowId
  ); // Pass windowId

  // Check if positions were inherited from another window
  const wasInherited = useMemo(() => {
    // Simple heuristic: if we have positions but no specific entry for this windowId:path combination,
    // then these were likely inherited from another window
    if (!windowId || Object.keys(persistentPositions).length === 0) {
      return false;
    }

    // We can't easily check the raw Redux state here, so we'll use a different approach
    // The selector already handles inheritance, so we'll trust that it worked correctly
    return Object.keys(persistentPositions).length > 0;
  }, [persistentPositions, windowId]);

  // File selection
  const {
    selectedFileIds,
    lastSelectedIndex,
    handleFileSelect,
    handleBackgroundClick,
    clearSelection,
    selectAll,
  } = useFileSelection(files);

  // File operations
  const { handleFileDoubleClick, handleFileMove, copyInheritedPositions } =
    useFileOperations({
      currentPath,
      onPathChange: handlePathChange,
      clearSelection,
      windowId, // Pass windowId
      inheritedPositions: wasInherited ? persistentPositions : undefined,
    });

  // Copy inherited positions to current window if needed - USE EFFECT TO PREVENT INFINITE LOOP
  useEffect(() => {
    // Only run once per path/window combination
    const positionsKey = `${windowId}-${currentPath}`;

    if (
      wasInherited &&
      Object.keys(persistentPositions).length > 0 &&
      !hasInitializedPositions.current
    ) {
      hasInitializedPositions.current = true;
      copyInheritedPositions();
    }

    // Reset flag when path changes
    return () => {
      if (currentPath) {
        hasInitializedPositions.current = false;
      }
    };
  }, [currentPath, windowId]); // Only depend on path and window changes, not position data

  // Keyboard navigation
  useExplorerKeyboard({
    files,
    selectedFileIds,
    lastSelectedIndex,
    viewMode,
    windowId,
    itemPositions: persistentPositions,
    onFileSelect: handleFileSelect,
    onFileDoubleClick: handleFileDoubleClick,
    onSelectAll: selectAll,
  });

  // Effects (refresh, focus, path changes)
  useExplorerEffects({
    windowId,
    currentPath,
    selectedFileIds,
    loadFilesForPath,
    clearSelection,
  });

  return {
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
  };
};
