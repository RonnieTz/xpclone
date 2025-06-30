import { useState, useEffect, useRef } from 'react';

interface UseToolbarButtonStateProps {
  hasDropdown: boolean;
  noDropDownIcon: boolean;
  disabled: boolean;
}

export const useToolbarButtonState = ({
  hasDropdown,
  noDropDownIcon,
  disabled,
}: UseToolbarButtonStateProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMainPressed, setIsMainPressed] = useState(false);
  const [isArrowPressed, setIsArrowPressed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMainMouseDown = () => {
    if (disabled) return;
    if (!isDropdownOpen) {
      setIsMainPressed(true);
    }
  };

  const handleMainMouseUp = () => {
    if (disabled) return;
    if (!isDropdownOpen) {
      setIsMainPressed(false);
    }
  };

  const handleArrowMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setIsArrowPressed(true);
  };

  const handleArrowMouseUp = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setIsArrowPressed(false);
  };

  const handleClick = (onClick?: () => void, onDropdownClick?: () => void) => {
    if (disabled) return;

    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      return;
    }

    if (hasDropdown && noDropDownIcon) {
      setIsDropdownOpen(true);
      onDropdownClick?.();
      return;
    }

    onClick?.();
  };

  const handleArrowClick = (
    e: React.MouseEvent,
    onDropdownClick?: () => void
  ) => {
    if (disabled) return;
    e.stopPropagation();

    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      return;
    }

    if (hasDropdown) {
      setIsDropdownOpen(true);
    }
    onDropdownClick?.();
  };

  return {
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
  };
};
