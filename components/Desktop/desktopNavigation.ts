export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export interface DesktopIcon {
  id: string;
  x: number;
  y: number;
  name: string;
}

export const findClosestIcon = (
  currentIcon: DesktopIcon,
  allIcons: DesktopIcon[],
  direction: NavigationDirection
): DesktopIcon | null => {
  const candidates = allIcons.filter((icon) => {
    if (icon.id === currentIcon.id) return false;

    switch (direction) {
      case 'up':
        return icon.y < currentIcon.y;
      case 'down':
        return icon.y > currentIcon.y;
      case 'left':
        return icon.x < currentIcon.x;
      case 'right':
        return icon.x > currentIcon.x;
      default:
        return false;
    }
  });

  if (candidates.length === 0) return null;

  // Find the closest icon based on direction
  return candidates.reduce((closest, candidate) => {
    const currentDistance = calculateDistance(
      currentIcon,
      candidate,
      direction
    );
    const closestDistance = calculateDistance(currentIcon, closest, direction);
    return currentDistance < closestDistance ? candidate : closest;
  });
};

export const calculateDistance = (
  from: DesktopIcon,
  to: DesktopIcon,
  direction: NavigationDirection
): number => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  // For vertical movement, prioritize vertical distance but consider horizontal alignment
  if (direction === 'up' || direction === 'down') {
    return dy + dx * 0.1; // Small horizontal penalty to prefer aligned icons
  }
  // For horizontal movement, prioritize horizontal distance but consider vertical alignment
  else {
    return dx + dy * 0.1; // Small vertical penalty to prefer aligned icons
  }
};
