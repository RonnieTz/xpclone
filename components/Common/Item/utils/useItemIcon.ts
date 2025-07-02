import { getIconPath } from '@/lib/iconMapping';
import { UnifiedItemData } from '../types';

export const useItemIcon = (item: UnifiedItemData) => {
  const getIconSrc = () => {
    if (item.icon) {
      return item.icon.startsWith('/')
        ? item.icon
        : `/${getIconPath(item.icon)}`;
    }
    return `/${getIconPath(item.type)}`;
  };

  return { getIconSrc };
};
