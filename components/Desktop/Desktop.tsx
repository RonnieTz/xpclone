'use client';

import React from 'react';

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
          onSelect={(event?: React.MouseEvent<HTMLElement>) =>
            handleIconSelect(icon.id, event)
          }
          onDoubleClick={() => onIconDoubleClick(icon.id, icon.name)}
          onMove={(x: number, y: number) => handleIconMove(icon.id, x, y)}
          currentPath="C:\\Documents and Settings\\Administrator\\Desktop"
        />
      ))}
    </DesktopBackground>
  );
};

export default Desktop;
