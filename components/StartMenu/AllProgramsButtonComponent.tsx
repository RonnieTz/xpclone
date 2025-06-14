import React from 'react';
import Image from 'next/image';
import type { Position } from './StartMenuItem';
import { BUTTON_WIDTH, BUTTON_HEIGHT } from './allProgramsData';

interface AllProgramsButtonComponentProps {
  position: Position;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const AllProgramsButtonComponent: React.FC<AllProgramsButtonComponentProps> = ({
  position,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <div
      data-all-programs-button
      className={`absolute flex items-center px-1.5 group ${
        isActive ? 'bg-[#316ac5]' : 'hover:bg-[#316ac5]'
      }`}
      style={{
        left: position.left,
        top: position.top,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div>
        <div
          className={`text-sm select-none font-bold w-25 ml-9 ${
            isActive ? 'text-white' : 'text-black group-hover:text-white'
          }`}
        >
          All Programs
        </div>
      </div>
      <Image
        src="/All Programs Icon.png"
        alt="All Programs"
        width={32}
        height={32}
        className="mr-2"
      />
    </div>
  );
};

export default AllProgramsButtonComponent;
