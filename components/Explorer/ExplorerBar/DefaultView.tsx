import React from 'react';

const DefaultView: React.FC = () => {
  return (
    <div
      className="w-full h-full"
      style={{
        background: 'linear-gradient(to bottom, #7aa1e6, #6375d6)',
        borderLeft: '1px solid white',
        borderBottom: '1px solid white',
      }}
    ></div>
  );
};

export default DefaultView;
