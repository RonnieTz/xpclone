import React from 'react';

interface ModalOverlayProps {
  id: string;
  parentWindowId: string;
  zIndex: number;
  onOverlayClick?: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  id,
  parentWindowId,
  zIndex,
  onOverlayClick,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on the overlay, not on children
    if (e.target === e.currentTarget) {
      onOverlayClick?.();
    }
  };

  return (
    <div
      data-modal-overlay
      data-modal-overlay-id={id}
      data-parent-window-id={parentWindowId}
      className="fixed inset-0 bg-black bg-opacity-20 pointer-events-auto"
      style={{
        zIndex: zIndex - 1, // Always one below the modal window
        top: 0,
        left: 0,
        right: 0,
        bottom: '40px', // Account for taskbar
      }}
      onClick={handleOverlayClick}
    />
  );
};

export default ModalOverlay;
