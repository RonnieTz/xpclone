import React from 'react';
import Image from 'next/image';
import { getFolderIcon } from '@/lib/iconMapping';

interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currentPath?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onKeyPress,
  currentPath = '',
}) => {
  const folderIcon = getFolderIcon(currentPath);

  return (
    <div
      className="flex-1 flex relative"
      style={{
        height: '100%',
        border: '1px solid #7f9db9',
        backgroundColor: 'white',
        alignItems: 'flex-end',
        paddingBottom: '4px',
      }}
    >
      <Image
        src={`/${folderIcon}`}
        alt="Folder"
        width={22}
        height={22}
        style={{
          marginLeft: '6px',
          marginRight: '8px',
          zIndex: 1,
          filter: 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3))',
        }}
      />
      <div className="flex-1">
        <input
          id="address-input"
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className="w-full text-sm text-black"
          style={{
            height: 'auto',
            border: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'Tahoma, Arial, sans-serif',
            fontSize: '13px',
            paddingLeft: '0px',
            paddingRight: '20px',
            outline: 'none',
            lineHeight: '20px',
          }}
          spellCheck={false}
        />
        <button
          type="button"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:brightness-105 active:brightness-90"
          style={{
            width: '23px',
            height: '86%',
            border: '1.5px solid #acbde6',
            backgroundColor: '#bdd3fb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.1s ease, filter 0.1s ease',
          }}
        >
          <svg
            width="10"
            height="8"
            viewBox="0 0 8 6"
            fill="none"
            style={{ color: '#4d6185' }}
          >
            <path
              d="M1 2L4 5L7 2"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddressInput;
