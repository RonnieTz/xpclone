import React from 'react';

interface DesktopBackgroundProps {
  children: React.ReactNode;
  onDesktopClick: (e: React.MouseEvent) => void;
}

const DesktopBackground: React.FC<DesktopBackgroundProps> = ({
  children,
  onDesktopClick,
}) => {
  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none"
      onClick={onDesktopClick}
      data-desktop
      style={{
        backgroundImage: 'url(/wallpaper.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'transparent',
      }}
    >
      {children}
    </div>
  );
};

export default DesktopBackground;
