'use client';

import React, { useState } from 'react';
import { UnifiedItemProps } from './types';
import { useItemInteraction } from './hooks/useItemInteraction';
import { useItemStyles } from './styles/useItemStyles';
import { useItemIcon } from './utils/useItemIcon';
import { IconView, ListView, DetailsView } from './renderers';

const UnifiedItem: React.FC<UnifiedItemProps> = ({
  item,
  context,
  viewMode = 'icons',
  isSelected = false,
  position,
  onSelect,
  onDoubleClick,
  onMove,
  className = '',
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Custom hooks
  const { itemRef, handleMouseDown } = useItemInteraction(
    item,
    onSelect,
    onMove
  );
  const { getItemClasses, getItemStyle, getIconSize } = useItemStyles(
    item,
    context,
    viewMode,
    isSelected,
    isHovered,
    position,
    className,
    style
  );
  const { getIconSrc } = useItemIcon(item);

  const renderContent = () => {
    const renderProps = {
      item,
      context,
      viewMode,
      isSelected,
      getIconSrc,
      getIconSize,
    };

    if (
      context === 'desktop' ||
      viewMode === 'icons' ||
      viewMode === 'thumbnails'
    ) {
      return <IconView {...renderProps} />;
    }

    switch (viewMode) {
      case 'list':
        return <ListView {...renderProps} />;
      case 'details':
        return <DetailsView {...renderProps} />;
      default:
        return <IconView {...renderProps} />;
    }
  };

  return (
    <div
      ref={itemRef}
      className={getItemClasses()}
      style={getItemStyle()}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && isSelected) {
          onDoubleClick?.();
        }
      }}
      tabIndex={isSelected ? 0 : -1}
      data-unified-item
      data-context={context}
      data-item-type={item.type}
    >
      {renderContent()}
    </div>
  );
};

export default UnifiedItem;
