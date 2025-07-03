import { ViewMode } from './types';

/**
 * Get CSS classes for file grid based on view mode
 */
export const getFileGridClasses = (
  viewMode: ViewMode,
  hasPositions: boolean
) => {
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
      if (hasPositions) {
        return 'relative w-full h-full';
      }
      return 'flex flex-row flex-wrap gap-0 items-start content-start';
  }
};

/**
 * Get CSS styles for file grid based on view mode
 */
export const getFileGridStyles = (viewMode: ViewMode) => {
  if (viewMode === 'thumbnails') {
    return {
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gridAutoFlow: 'row',
    };
  }
  return {};
};
