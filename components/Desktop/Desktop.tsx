'use client';

import React from 'react';
import DesktopIcon from './DesktopIcon';
import DesktopBackground from './DesktopBackground';
import { useDesktop } from './useDesktop';

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
          onSelect={(event) => handleIconSelect(icon.id, event)}
          onDoubleClick={() => onIconDoubleClick(icon.id, icon.name)}
          onMove={(x, y) => handleIconMove(icon.id, x, y)}
        />
      ))}
    </DesktopBackground>
  );
};

export default Desktop;
