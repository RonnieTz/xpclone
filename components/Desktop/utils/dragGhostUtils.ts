// Get viewport position of element
export const getViewportPosition = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };
};

// Create a ghost element for dragging
export const createDragGhost = (element: HTMLElement): HTMLElement => {
  const ghost = element.cloneNode(true) as HTMLElement;
  ghost.classList.add('dragging-ghost');
  ghost.style.position = 'fixed';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '10000';
  ghost.style.opacity = '0.8';
  ghost.style.transform = 'none';
  document.body.appendChild(ghost);
  return ghost;
};

// Remove ghost element from DOM
export const removeDragGhost = (ghost: HTMLElement | null) => {
  if (ghost && ghost.parentNode) {
    document.body.removeChild(ghost);
  }
};

// Update ghost element position
export const updateGhostPosition = (
  ghost: HTMLElement,
  x: number,
  y: number
) => {
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;
};
