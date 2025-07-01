import { useState } from 'react';
import { ExplorerBarState } from '../types';
import { ViewMode } from '../FolderContent';

interface UseExplorerStateReturn {
  viewMode: ViewMode;
  explorerBarState: ExplorerBarState;
  setExplorerBarState: (state: ExplorerBarState) => void;
}

export const useExplorerState = (): UseExplorerStateReturn => {
  const [viewMode] = useState<ViewMode>('icons');
  const [explorerBarState, setExplorerBarState] =
    useState<ExplorerBarState>('Default');

  return {
    viewMode,
    explorerBarState,
    setExplorerBarState,
  };
};
