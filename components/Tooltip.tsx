import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  text: string;
  targetRef: React.RefObject<HTMLDivElement | null>;
  tooltipId: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, targetRef, tooltipId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseInsideRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseMoveThrottleRef = useRef<NodeJS.Timeout | null>(null);

  const clearShowTimeout = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
  };

  const scheduleTooltipShow = (clientX: number, clientY: number) => {
    // clearShowTimeout();

    showTimeoutRef.current = setTimeout(() => {
      setPosition({
        top: clientY + window.scrollY + 20,
        left: clientX + window.scrollX,
      });

      setIsVisible(true);
    }, 1000);
  };

  const handleMouseEnter = useCallback(
    (event: MouseEvent) => {
      isMouseInsideRef.current = true;

      lastMousePositionRef.current = { x: event.clientX, y: event.clientY };

      // Hide any existing tooltip immediately
      setIsVisible(false);

      // Schedule this tooltip to show
      scheduleTooltipShow(event.clientX, event.clientY);
    },
    [tooltipId]
  );

  const handleMouseMove = useCallback((event: MouseEvent) => {
    // Throttle mouse move events to prevent excessive executions
    if (mouseMoveThrottleRef.current) {
      return; // Skip this event if we're still throttling
    }

    mouseMoveThrottleRef.current = setTimeout(() => {
      mouseMoveThrottleRef.current = null;
    }, 100); // Throttle to execute at most once every 100ms

    clearShowTimeout();
    setIsVisible(false);

    const { clientX, clientY } = event;
    scheduleTooltipShow(clientX, clientY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isMouseInsideRef.current = false;
    clearShowTimeout();

    // Hide tooltip if it's currently visible
    if (isVisible) {
      setIsVisible(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const element = targetRef.current;
    if (element) {
      const mouseEnterHandler = (e: Event) => {
        handleMouseEnter(e as MouseEvent);
      };

      const mouseMoveHandler = (e: Event) => {
        handleMouseMove(e as MouseEvent);
      };

      const mouseLeaveHandler = () => {
        handleMouseLeave();
      };

      element.addEventListener('mouseenter', mouseEnterHandler);
      element.addEventListener('mousemove', mouseMoveHandler);
      element.addEventListener('mouseleave', mouseLeaveHandler);

      return () => {
        element.removeEventListener('mouseenter', mouseEnterHandler);
        element.removeEventListener('mousemove', mouseMoveHandler);
        element.removeEventListener('mouseleave', mouseLeaveHandler);
        clearShowTimeout();

        // Clear mouse move throttle timeout
        if (mouseMoveThrottleRef.current) {
          clearTimeout(mouseMoveThrottleRef.current);
          mouseMoveThrottleRef.current = null;
        }

        // Hide tooltip when component unmounts
        setIsVisible(false);
      };
    }
  }, [
    tooltipId,
    targetRef,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  ]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className="absolute visible w-auto max-w-[500px] bg-yellow-100 text-black border border-black px-1 z-[1000] text-xs"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {text}
    </div>,
    document.body
  );
};

export default Tooltip;
