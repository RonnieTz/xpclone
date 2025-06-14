'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { updateTime } from '@/lib/slices/taskbarSlice';

const Clock: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTime } = useSelector((state: RootState) => state.taskbar);

  const [showTooltip, setShowTooltip] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [clockRef, setClockRef] = useState<HTMLDivElement | null>(null);
  const [tooltipTimeoutRef, setTooltipTimeoutRef] =
    useState<NodeJS.Timeout | null>(null);

  // Set hydrated state on client side only
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update time every second to show seconds
  useEffect(() => {
    if (!isHydrated) return;

    const updateCurrentTime = () => {
      const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const date = new Date().toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      dispatch(updateTime(time));
      setCurrentDate(date);
    };

    const interval = setInterval(updateCurrentTime, 1000);
    updateCurrentTime();

    return () => clearInterval(interval);
  }, [dispatch, isHydrated]);

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (tooltipTimeoutRef) {
      clearTimeout(tooltipTimeoutRef);
    }

    // Set a new timeout to show tooltip after 1 second
    const timeout = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);

    setTooltipTimeoutRef(timeout);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);

    // Clear the timeout if mouse leaves before 1 second
    if (tooltipTimeoutRef) {
      clearTimeout(tooltipTimeoutRef);
      setTooltipTimeoutRef(null);
    }
  };

  // Calculate tooltip position based on clock position
  const getTooltipPosition = () => {
    if (!clockRef) return { bottom: '50px', right: '20px' };

    const rect = clockRef.getBoundingClientRect();
    return {
      bottom: `${window.innerHeight - rect.top}px`, // Position above the clock
      right: `${window.innerWidth - rect.right}px`, // Align with right edge of clock
    };
  };

  // Tooltip component that renders to document body
  const tooltip =
    showTooltip && typeof document !== 'undefined' && clockRef && currentDate
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
            {currentDate}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={setClockRef}
        className="h-full flex items-center justify-center relative"
        style={{
          backgroundImage: 'url(/clock.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100px',
          minWidth: '100px',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span
          className="text-white text-xs font-mono"
          style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        >
          {currentTime}
        </span>
      </div>
      {tooltip}
    </>
  );
};

export default Clock;
