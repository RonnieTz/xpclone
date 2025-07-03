import { useCallback } from 'react';

export const useGhostElement = () => {
  // Get viewport position of element with full dimensions
  const getViewportPosition = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  // Create ghost element for dragging
  const createGhostElement = useCallback(
    (element: HTMLElement): HTMLElement => {
      const ghost = element.cloneNode(true) as HTMLElement;
      ghost.classList.add('drag-ghost', 'dragging-ghost');
      ghost.style.position = 'fixed';
      ghost.style.pointerEvents = 'none';
      ghost.style.zIndex = '10000';
      ghost.style.opacity = '0.8';
      ghost.style.transform = 'none';
      ghost.style.transition = 'none';
      document.body.appendChild(ghost);
      return ghost;
    },
    []
  );

  // Update ghost position
  const updateGhostPosition = useCallback(
    (ghost: HTMLElement, x: number, y: number) => {
      ghost.style.left = `${x}px`;
      ghost.style.top = `${y}px`;
    },
    []
  );

  // Remove ghost element
  const removeGhostElement = useCallback((ghost: HTMLElement | null) => {
    if (ghost && ghost.parentNode) {
      document.body.removeChild(ghost);
    }
  }, []);

  return {
    getViewportPosition,
    createGhostElement,
    updateGhostPosition,
    removeGhostElement,
  };
};
