import { useCallback } from 'react';

export const useDragGhost = () => {
  // Get viewport position of element relative to its container
  const getViewportPosition = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  // Create dragging ghost element
  const createDragGhost = useCallback((element: HTMLElement) => {
    const ghost = element.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '10000';
    ghost.style.opacity = '0.8';
    ghost.style.transform = 'none'; // Remove the scale to keep original size
    ghost.style.transition = 'none';
    ghost.classList.add('dragging-ghost'); // Add class for filtering
    document.body.appendChild(ghost);
    return ghost;
  }, []);

  return {
    getViewportPosition,
    createDragGhost,
  };
};
