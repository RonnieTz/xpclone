import { useState, useRef, useCallback } from 'react';
import { HOVER_DELAY } from './allProgramsData';

// Custom hook for hover timeout logic
export const useHoverTimeout = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    clearHoverTimeout();

    hoverTimeoutRef.current = setTimeout(() => {
      setIsMenuVisible(true);
    }, HOVER_DELAY);
  }, [clearHoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    clearHoverTimeout();
  }, [clearHoverTimeout]);

  const handleClick = useCallback(() => {
    if (isMenuVisible) {
      setIsMenuVisible(false);
      clearHoverTimeout();

      hoverTimeoutRef.current = setTimeout(() => {
        if (isHovered) {
          setIsMenuVisible(true);
        }
      }, HOVER_DELAY);
    }
  }, [isMenuVisible, isHovered, clearHoverTimeout]);

  const handleMenuClose = useCallback(() => {
    setIsMenuVisible(false);
  }, []);

  return {
    isHovered,
    isMenuVisible,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleMenuClose,
  };
};
