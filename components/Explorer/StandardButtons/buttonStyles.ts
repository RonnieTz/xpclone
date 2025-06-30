interface ButtonStyleProps {
  isHovered: boolean;
  isMainPressed: boolean;
  isArrowPressed: boolean;
  isDropdownOpen: boolean;
  hasDropdown: boolean;
  noDropDownIcon: boolean;
  disabled: boolean;
}

export const getMainButtonClasses = ({
  hasDropdown,
  noDropDownIcon,
  isMainPressed,
  isDropdownOpen,
  isHovered,
  disabled,
}: ButtonStyleProps) => {
  let classes = 'h-full flex items-center px-2 gap-2 relative cursor-pointer';

  // Apply border radius based on whether there's an arrow button
  if (hasDropdown && !noDropDownIcon) {
    classes += ' rounded-l-sm';
  } else {
    classes += ' rounded-sm';
  }

  // Add right margin when arrow down icon is present
  if (hasDropdown && !noDropDownIcon) {
    classes += ' mr-[25px]';
  }

  // Keep main button in clicked state when dropdown is open and no dropdown icon
  if (isMainPressed || (isDropdownOpen && hasDropdown && noDropDownIcon)) {
    classes += ' text-white bg-[#e3e3dc]';
  } else if (isHovered || (isDropdownOpen && hasDropdown && !noDropDownIcon)) {
    classes += ' border border-[#cecec3] text-black';
  } else {
    classes += ' border border-transparent text-black';
  }

  // Add disabled styles
  if (disabled) {
    classes += ' opacity-50 cursor-not-allowed';
  }

  return classes;
};

export const getMainButtonStyle = ({
  isMainPressed,
  isDropdownOpen,
  hasDropdown,
  noDropDownIcon,
  isHovered,
}: ButtonStyleProps) => {
  // Keep main button in clicked styling when dropdown is open and no dropdown icon
  if (isMainPressed || (isDropdownOpen && hasDropdown && noDropDownIcon)) {
    return {
      border: '1px solid #9d9d92',
    };
  } else if (isHovered || (isDropdownOpen && hasDropdown && !noDropDownIcon)) {
    return {
      background: 'linear-gradient(to bottom, #fcfcfa, #f0f0e9)',
      boxShadow: 'inset 0 -2px 2px rgba(0, 0, 0, 0.2)',
    };
  }
  return {};
};

export const getArrowButtonClasses = ({
  isArrowPressed,
  isMainPressed,
  isDropdownOpen,
  isHovered,
  disabled,
}: ButtonStyleProps) => {
  let classes =
    'text-[9px] flex items-center px-1 absolute left-full cursor-pointer rounded-r-sm';
  classes += ' h-[calc(100%+2px)]';

  // Keep arrow pressed when dropdown is open or when actually pressed
  if (isArrowPressed || isMainPressed || isDropdownOpen) {
    classes += ' text-black bg-[#e3e3dc]';
  } else if (isHovered) {
    classes += ' border border-[#cecec3] text-black';
  } else {
    classes += ' border border-transparent text-black bg-transparent';
  }

  // Add disabled styles
  if (disabled) {
    classes += ' opacity-50 cursor-not-allowed';
  }

  return classes;
};

export const getArrowButtonStyle = ({
  isArrowPressed,
  isMainPressed,
  isDropdownOpen,
  isHovered,
}: ButtonStyleProps) => {
  // Keep arrow pressed styling when dropdown is open or when actually pressed
  if (isArrowPressed || isMainPressed || isDropdownOpen) {
    return {
      border: '1px solid #9d9d92',
    };
  } else if (isHovered) {
    return {
      background: 'linear-gradient(to bottom, #fcfcfa, #f0f0e9)',
      boxShadow: 'inset 0 -2px 2px rgba(0, 0, 0, 0.2)',
    };
  }
  return {};
};
