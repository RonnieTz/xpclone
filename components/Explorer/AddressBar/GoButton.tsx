import React from 'react';
import Image from 'next/image';

interface GoButtonProps {
  onClick: () => void;
}

const GoButton: React.FC<GoButtonProps> = ({ onClick }) => {
  return (
    <button
      className="pl-1 pr-7 border border-gray-400 hover:bg-gray-300 text-black flex items-center gap-1"
      onClick={onClick}
      style={{
        fontFamily: 'Tahoma, Arial, sans-serif',
        height: '100%',
        background: 'linear-gradient(to bottom, #ece9d3, #e7e3cd)',
        boxShadow: 'inset 0 -1px 2px rgba(0, 0, 0, 0.1)',
        border: 'none',
        fontSize: '13px',
      }}
    >
      <Image className="mr-1" src="/Go.png" alt="Go" width={30} height={30} />
      Go
    </button>
  );
};

export default GoButton;
