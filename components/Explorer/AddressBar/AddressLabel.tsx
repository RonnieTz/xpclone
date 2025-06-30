import React from 'react';

interface AddressLabelProps {
  onClick?: () => void;
}

const AddressLabel: React.FC<AddressLabelProps> = ({ onClick }) => {
  return (
    <div
      className="text-black text-sm font-normal cursor-pointer select-none flex items-center px-2"
      onClick={onClick}
      style={{
        fontFamily: 'Tahoma, Arial, sans-serif',
        color: '#7f7c73',
        height: '100%',
        background: 'linear-gradient(to bottom, #eeeee8, #edede5)',
        boxShadow: 'inset 0 -1px 2px rgba(0, 0, 0, 0.3)',
      }}
    >
      Address
    </div>
  );
};

export default AddressLabel;
