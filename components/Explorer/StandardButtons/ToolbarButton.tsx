import React from 'react';
import Image from 'next/image';
import ToolbarDropdown from '../Toolbar/ToolbarDropdown';
import { useToolbarButtonState } from './useToolbarButtonState';
import {
  getMainButtonClasses,
  getMainButtonStyle,
  getArrowButtonClasses,
  getArrowButtonStyle,
} from './buttonStyles';

interface ToolbarButtonProps {
  icon?: string;
  text?: string;
  onClick?: () => void;
  hasDropdown?: boolean;
  noDropDownIcon?: boolean;
  onDropdownClick?: () => void;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  text,
  onClick,
  hasDropdown = false,
  noDropDownIcon = false,
  onDropdownClick,
  disabled = false,
}) => {
  const {
    isHovered,
    setIsHovered,
    isMainPressed,
    isArrowPressed,
    isDropdownOpen,
    setIsDropdownOpen,
    buttonRef,
    handleMainMouseDown,
    handleMainMouseUp,
    handleArrowMouseDown,
    handleArrowMouseUp,
    handleClick,
    handleArrowClick,
  } = useToolbarButtonState({ hasDropdown, noDropDownIcon, disabled });

  const styleProps = {
    isHovered,
    isMainPressed,
    isArrowPressed,
    isDropdownOpen,
    hasDropdown,
    noDropDownIcon,
    disabled,
  };

  return (
    <div
      ref={buttonRef}
      className={getMainButtonClasses(styleProps)}
      style={getMainButtonStyle(styleProps)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMainMouseDown}
      onMouseUp={handleMainMouseUp}
      onClick={() => handleClick(onClick, onDropdownClick)}
    >
      {icon && <Image height={30} width={30} src={icon} alt="icon" />}
      {text && <div>{text}</div>}

      {hasDropdown && !noDropDownIcon && (
        <div
          className={getArrowButtonClasses(styleProps)}
          style={getArrowButtonStyle(styleProps)}
          onMouseDown={handleArrowMouseDown}
          onMouseUp={handleArrowMouseUp}
          onClick={(e) => handleArrowClick(e, onDropdownClick)}
        >
          <span
            style={{
              fontSize: '8px',
              scale: '1 0.7',
            }}
          >
            ▼
          </span>
        </div>
      )}

      {hasDropdown && (
        <ToolbarDropdown
          isOpen={isDropdownOpen}
          position={{ x: 0, y: 43 }}
          onClose={() => setIsDropdownOpen(false)}
        >
          <p>New item</p>
          <p>New item</p>
          <p>New item</p>
        </ToolbarDropdown>
      )}
    </div>
  );
};

export default ToolbarButton;
