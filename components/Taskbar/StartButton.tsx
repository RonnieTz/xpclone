'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleStartButton } from '@/lib/slices/taskbarSlice';
import { setStartMenuOpen } from '@/lib/slices/startMenuSlice';

const StartButton: React.FC = () => {
  const dispatch = useDispatch();
  const { startButtonPressed } = useSelector(
    (state: RootState) => state.taskbar
  );
  const { isOpen: startMenuOpen } = useSelector(
    (state: RootState) => state.startMenu
  );

  const [isStartButtonHovered, setIsStartButtonHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [tooltipTimeoutRef, setTooltipTimeoutRef] =
    useState<NodeJS.Timeout | null>(null);

  const handleStartButtonClick = () => {
    dispatch(toggleStartButton());
    dispatch(setStartMenuOpen(!startMenuOpen));
  };

  const getStartButtonImage = () => {
    if (startButtonPressed || startMenuOpen) {
      return '/start-button-open.png';
    }
    if (isStartButtonHovered) {
      return '/start-button-hover.png';
    }
    return '/start-button-normal.png';
  };

  // Calculate tooltip position based on button position
  const getTooltipPosition = () => {
    if (!buttonRef) return { bottom: '50px', left: '20px' };

    const rect = buttonRef.getBoundingClientRect();
    return {
      bottom: `${window.innerHeight - rect.top}px`, // Position above the button
      left: `${rect.left + 20}px`, // 20px to the right of button start (matching left-5)
    };
  };

  const handleMouseEnter = () => {
    setIsStartButtonHovered(true);

    // Don't show tooltip if start menu is open
    if (startMenuOpen) {
      return;
    }

    // Clear any existing timeout
    if (tooltipTimeoutRef) {
      clearTimeout(tooltipTimeoutRef);
    }

    // Set a new timeout to show tooltip after 1 second
    const timeout = setTimeout(() => {
      // Double-check that start menu is still closed when timeout fires
      if (!startMenuOpen) {
        setShowTooltip(true);
      }
    }, 1000);

    setTooltipTimeoutRef(timeout);
  };

  const handleMouseLeave = () => {
    setIsStartButtonHovered(false);
    setShowTooltip(false);

    // Clear the timeout if mouse leaves before 1 second
    if (tooltipTimeoutRef) {
      clearTimeout(tooltipTimeoutRef);
      setTooltipTimeoutRef(null);
    }
  };

  // Hide tooltip when start menu opens
  useEffect(() => {
    if (startMenuOpen) {
      setShowTooltip(false);
      // Also clear any pending timeout
      if (tooltipTimeoutRef) {
        clearTimeout(tooltipTimeoutRef);
        setTooltipTimeoutRef(null);
      }
    }
  }, [startMenuOpen, tooltipTimeoutRef]);

  // Tooltip component that renders to document body
  const tooltip =
    showTooltip && typeof document !== 'undefined' && buttonRef
      ? createPortal(
          <div
            style={{
              position: 'fixed',
              ...getTooltipPosition(),
              backgroundColor: 'white',
              border: '1px solid black',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontFamily: 'Tahoma, Arial, Helvetica, sans-serif',
              fontSize: '11px',
              color: '#000',
              whiteSpace: 'nowrap',
              padding: '0 8px',
              zIndex: 2147483647,
              pointerEvents: 'none',
            }}
          >
            Click here to begin
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={setButtonRef}
        className="relative flex items-center transition-all h-full"
        onClick={handleStartButtonClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundImage: `url(${getStartButtonImage()})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
          width: '130px',
          border: 'none',
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
        }}
      />
      {tooltip}
    </>
  );
};

export default StartButton;
