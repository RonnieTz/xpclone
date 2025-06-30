import React, { useState, useEffect } from 'react';
import AddressLabel from './AddressLabel';
import AddressInput from './AddressInput';
import GoButton from './GoButton';

interface AddressBarProps {
  currentPath?: string;
  onPathChange?: (path: string) => void;
}

const AddressBar: React.FC<AddressBarProps> = ({
  currentPath = 'C:\\',
  onPathChange,
}) => {
  const [inputValue, setInputValue] = useState(currentPath);

  // Update input value when currentPath changes (from navigation)
  useEffect(() => {
    setInputValue(currentPath);
  }, [currentPath]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPathChange?.(inputValue);
    }
  };

  const handleAddressLabelClick = () => {
    // Focus the input when "Address" label is clicked
    const input = document.getElementById('address-input');
    input?.focus();
  };

  return (
    <div
      className="w-full flex items-center flex-shrink-0"
      style={{
        height: '35px',
        backgroundColor: 'lightblue',
        borderTop: '1px solid white',
      }}
    >
      <AddressLabel onClick={handleAddressLabelClick} />

      <AddressInput
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        currentPath={currentPath}
      />

      <GoButton onClick={() => onPathChange?.(inputValue)} />
    </div>
  );
};

export default AddressBar;
