import React from 'react';
import Image from 'next/image';
import { ItemRenderProps } from '../types';

export const IconView: React.FC<ItemRenderProps> = ({
  item,
  context,
  isSelected,
  getIconSrc,
  getIconSize,
}) => {
  const iconSize = getIconSize();
  const isDesktop = context === 'desktop';

  return (
    <>
      <div className="mb-1 select-none">
        <Image
          src={getIconSrc()}
          alt={item.name}
          width={iconSize.width}
          height={iconSize.height}
          className={`object-contain ${
            isSelected && isDesktop ? 'brightness-65' : ''
          }`}
          style={{
            filter: 'drop-shadow(1px 3px 2px rgba(0, 0, 0, 0.3))',
          }}
          draggable={false}
        />
      </div>
      <div
        className={`text-xs text-center max-w-full break-words select-none leading-tight px-2 py-0.5`}
        style={{
          backgroundColor: isSelected ? '#316ac5' : 'transparent',
          color: isDesktop
            ? isSelected
              ? 'white'
              : 'white'
            : isSelected
            ? 'white'
            : 'black',
          textShadow:
            isDesktop && !isSelected
              ? '1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 1px rgba(0, 0, 0, 0.5)'
              : 'none',
          fontFamily: 'Tahoma, Arial, sans-serif',
          fontSize: '11px',
        }}
      >
        {item.name}
      </div>
    </>
  );
};
