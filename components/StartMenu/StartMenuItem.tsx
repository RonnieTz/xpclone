import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Tooltip from '../Tooltip';

// Shared type for position
export interface Position {
  left: number;
  top: number;
}

interface StartMenuItemProps {
  title: string;
  iconFileName: string;
  textColor: 'blue' | 'black';
  position: Position;
  bold?: boolean;
  description?: string;
  onClick: () => void;
  hasExpandArrow?: boolean; // Optional expand arrow
  fontSize: number; // Optional font size, not used in this component but can be passed
}

const StartMenuItem: React.FC<StartMenuItemProps> = ({
  title,
  iconFileName,
  position,
  textColor,
  bold = false,
  description,
  onClick,
  hasExpandArrow = false,
  fontSize, // Not used in this component but can be passed
}) => {
  const [hovered, setHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {!hasExpandArrow && (
        <Tooltip text={description || title} targetRef={itemRef} />
      )}
      <div
        ref={itemRef}
        className="absolute flex items-center px-1.5 hover:bg-[#316ac5] cursor-pointer group"
        style={{
          left: position.left,
          top: position.top,
          width: 240,
          height: fontSize === 14 ? 37 : 30,
        }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={`/${iconFileName}`}
          alt={title}
          width={fontSize === 14 ? 30 : 24}
          height={fontSize === 14 ? 30 : 24}
          className="mr-2"
          style={{
            filter: hovered
              ? 'none'
              : 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))',
            aspectRatio: '1 / 1',
          }}
        />
        <div className="flex-1 min-w-0">
          <div
            className={`text-sm select-none ${
              bold ? 'font-bold' : 'font-normal'
            }`}
            style={{
              color: hovered
                ? '#fff'
                : textColor === 'blue'
                ? '#0a246a'
                : '#000',
              fontSize,
            }}
          >
            {title}
          </div>
        </div>
        {hasExpandArrow && (
          <span className="ml-auto pr-1 flex items-center h-full">
            <svg
              width="8"
              height="12"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <polygon points="2,2 8,8 2,14" fill={hovered ? '#fff' : '#222'} />
            </svg>
          </span>
        )}
      </div>
    </>
  );
};

export default StartMenuItem;
