import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  setShowAddressBar,
  setShowStandardBar,
  setShowStatusBar,
  setShowTaskPane,
  setShowFolderList,
  setViewType,
  setArrangeIconsBy,
  setShowHiddenFiles,
  setShowFileExtensions,
  resetToDefaults,
  FolderOptions as FolderOptionsType,
} from '@/lib/slices/folderOptionsSlice';

export const useFolderOptionsHandlers = () => {
  const dispatch = useDispatch();

  const handleToggle = useCallback(
    (key: keyof FolderOptionsType, value: boolean) => {
      switch (key) {
        case 'showAddressBar':
          dispatch(setShowAddressBar(value));
          break;
        case 'showStandardBar':
          dispatch(setShowStandardBar(value));
          break;
        case 'showStatusBar':
          dispatch(setShowStatusBar(value));
          break;
        case 'showTaskPane':
          dispatch(setShowTaskPane(value));
          break;
        case 'showFolderList':
          dispatch(setShowFolderList(value));
          break;
        case 'showHiddenFiles':
          dispatch(setShowHiddenFiles(value));
          break;
        case 'showFileExtensions':
          dispatch(setShowFileExtensions(value));
          break;
      }
    },
    [dispatch]
  );

  const handleViewTypeChange = useCallback(
    (viewType: FolderOptionsType['viewType']) => {
      dispatch(setViewType(viewType));
    },
    [dispatch]
  );

  const handleArrangeIconsChange = useCallback(
    (arrangeBy: FolderOptionsType['arrangeIconsBy']) => {
      dispatch(setArrangeIconsBy(arrangeBy));
    },
    [dispatch]
  );

  const handleRestoreDefaults = useCallback(() => {
    dispatch(resetToDefaults());
  }, [dispatch]);

  return {
    handleToggle,
    handleViewTypeChange,
    handleArrangeIconsChange,
    handleRestoreDefaults,
  };
};
