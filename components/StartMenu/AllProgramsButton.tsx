import React from 'react';
import type { Position } from './StartMenuItem';
import AllProgramsMenu from './AllProgramsMenu';
import AllProgramsButtonComponent from './AllProgramsButtonComponent';
import AllProgramsMenuItems from './AllProgramsMenuItems';
import { useHoverTimeout } from './useHoverTimeout';
import { MENU_POSITION } from './allProgramsData';

interface AllProgramsButtonProps {
  position: Position;
}

const AllProgramsButton: React.FC<AllProgramsButtonProps> = ({ position }) => {
  const {
    isHovered,
    isMenuVisible,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleMenuClose,
  } = useHoverTimeout();

  const shouldShowHoveredState = isHovered || isMenuVisible;

  return (
    <>
      <AllProgramsButtonComponent
        position={position}
        isActive={shouldShowHoveredState}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      <AllProgramsMenu
        isVisible={isMenuVisible}
        onClose={handleMenuClose}
        position={MENU_POSITION}
      >
        <AllProgramsMenuItems onClose={handleMenuClose} />
      </AllProgramsMenu>
    </>
  );
};

export default AllProgramsButton;
