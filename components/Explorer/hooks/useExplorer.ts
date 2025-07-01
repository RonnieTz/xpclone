import { useRef } from 'react';
import { ExplorerProps } from '../types';
import { useExplorerState } from './useExplorerState';
import { useExplorerSelectors } from './useExplorerSelectors';
import { useExplorerNavigation } from './useExplorerNavigation';
import { useFileSelection } from './useFileSelection';
import { useFileOperations } from './useFileOperations';
import { useExplorerKeyboard } from './useExplorerKeyboard';
import { useExplorerEffects } from './useExplorerEffects';

interface UseExplorerReturn {
  // Refs
  explorerRef: React.RefObject<HTMLDivElement | null>;

  // State
  viewMode: ReturnType<typeof useExplorerState>['viewMode'];
  explorerBarState: ReturnType<typeof useExplorerState>['explorerBarState'];
  setExplorerBarState: ReturnType<
    typeof useExplorerState
  >['setExplorerBarState'];

  // Selectors
  folderOptions: ReturnType<typeof useExplorerSelectors>['folderOptions'];
  persistentPositions: ReturnType<
    typeof useExplorerSelectors
  >['persistentPositions'];

  // Navigation
  currentPath: string;
  files: ReturnType<typeof useExplorerNavigation>['files'];
  handlePathChange: ReturnType<
    typeof useExplorerNavigation
  >['handlePathChange'];

  // File Selection
  selectedFileIds: string[];
  handleFileSelect: ReturnType<typeof useFileSelection>['handleFileSelect'];
  handleBackgroundClick: ReturnType<
    typeof useFileSelection
  >['handleBackgroundClick'];
  selectAll: ReturnType<typeof useFileSelection>['selectAll'];

  // File Operations
  handleFileDoubleClick: ReturnType<
    typeof useFileOperations
  >['handleFileDoubleClick'];
  handleFileMove: ReturnType<typeof useFileOperations>['handleFileMove'];
}

export const useExplorer = ({
  path,
  windowId,
}: ExplorerProps): UseExplorerReturn => {
  const explorerRef = useRef<HTMLDivElement | null>(null);

  // State management
  const { viewMode, explorerBarState, setExplorerBarState } =
    useExplorerState();

  // Navigation
  const { currentPath, files, handlePathChange, loadFilesForPath } =
    useExplorerNavigation({
      initialPath: path,
      windowId,
    });

  // Selectors
  const { folderOptions, persistentPositions } =
    useExplorerSelectors(currentPath);

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
  const { handleFileDoubleClick, handleFileMove } = useFileOperations({
    currentPath,
    onPathChange: handlePathChange,
    clearSelection,
  });

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
