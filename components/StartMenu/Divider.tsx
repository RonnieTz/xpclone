import React from 'react';
import Image from 'next/image';
import type { Position } from './StartMenuItem';

type DividerProps = {
  color: 'blue' | 'gray';
  position: Position;
};

const Divider = ({ color, position }: DividerProps) => {
  return (
    <div
      style={{
        width: '240px',
        height: position.top !== 0 ? 20 : 10,
        position: position.top !== 0 ? 'absolute' : 'initial',
        left: position.left,
        top: position.top,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src={`/menu-divider-${color}.png`}
        alt="divider"
        width={192}
        height={16}
        style={{ width: '80%', height: '80%' }}
      />
    </div>
  );
};

export default Divider;
