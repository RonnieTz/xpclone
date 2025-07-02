import React from 'react';
import Image from 'next/image';
import { ItemRenderProps } from '../types';

export const ListView: React.FC<ItemRenderProps> = ({
  item,
  getIconSrc,
  getIconSize,
}) => {
  const iconSize = getIconSize();

  return (
    <>
      <Image
        src={getIconSrc()}
        alt={item.name}
        width={iconSize.width}
        height={iconSize.height}
        className="mr-2 object-contain"
      />
      <span className="text-sm text-black truncate">{item.name}</span>
    </>
  );
};
