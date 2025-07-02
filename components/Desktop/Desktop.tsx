'use client';

import React from 'react';

import DesktopIcon from './components/DesktopIcon';
import DesktopBackground from './components/DesktopBackground';
import { useDesktop } from './hooks/useDesktop';
import UnifiedItem from '@/components/Common/Item';
import { convertDesktopIconToUnified } from '@/components/Common/Item/utils';

const Desktop: React.FC = () => {
  const {
    icons,
    selectedIconIds,
    handleDesktopClick,
    handleIconSelect,
    onIconDoubleClick,
    handleIconMove,
  } = useDesktop();

  return (
    <DesktopBackground onDesktopClick={handleDesktopClick}>
      {icons.map((icon) => (
        <UnifiedItem
          key={icon.id}
          item={convertDesktopIconToUnified(icon)}
          context="desktop"
          isSelected={selectedIconIds.includes(icon.id)}
          onSelect={(event?: React.MouseEvent) =>
            handleIconSelect(icon.id, event)
          }
          onDoubleClick={() => onIconDoubleClick(icon.id, icon.name)}
          onMove={(x: number, y: number) => handleIconMove(icon.id, x, y)}
        />
      ))}
    </DesktopBackground>
  );
};

export default Desktop;
