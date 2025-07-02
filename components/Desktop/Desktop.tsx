'use client';

import React from 'react';
import DesktopIcon from './components/DesktopIcon';
import DesktopBackground from './components/DesktopBackground';
import { useDesktop } from './hooks/useDesktop';

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
        <DesktopIcon
          key={icon.id}
          icon={icon}
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
