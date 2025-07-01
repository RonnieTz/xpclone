import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface UseExplorerSelectorsReturn {
  folderOptions: ReturnType<
    typeof import('@/lib/store')['store']['getState']
  >['folderOptions']['options'];
  persistentPositions: Record<string, { x: number; y: number }>;
}

export const useExplorerSelectors = (
  currentPath: string
): UseExplorerSelectorsReturn => {
  const folderOptions = useSelector(
    (state: RootState) => state.folderOptions.options
  );

  const persistentPositions = useSelector(
    (state: RootState) =>
      state.folderPositions.folderPositions[currentPath] || {}
  );

  return {
    folderOptions,
    persistentPositions,
  };
};
