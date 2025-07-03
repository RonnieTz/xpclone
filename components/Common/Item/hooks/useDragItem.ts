import { useDrag } from 'react-dnd';
import { UnifiedItemData } from '../types/dragDropTypes';

interface UseDragProps {
  item: UnifiedItemData;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const useDragItem = ({ item, onDragStart, onDragEnd }: UseDragProps) => {
  const [{ opacity }, dragRef] = useDrag({
    type: 'ITEM',
    item: () => {
      onDragStart?.();
      return item;
    },
    end: () => {
      onDragEnd?.();
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return {
    dragRef,
    opacity,
  };
};
