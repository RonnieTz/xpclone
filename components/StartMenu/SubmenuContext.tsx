'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubmenuContextType {
  activeSubmenuId: string | null;
  setActiveSubmenu: (id: string | null) => void;
  hoveredItemId: string | null;
  setHoveredItem: (id: string | null) => void;
}

const SubmenuContext = createContext<SubmenuContextType | undefined>(undefined);

export const useSubmenuContext = () => {
  const context = useContext(SubmenuContext);
  if (!context) {
    throw new Error('useSubmenuContext must be used within a SubmenuProvider');
  }
  return context;
};

interface SubmenuProviderProps {
  children: ReactNode;
}

export const SubmenuProvider: React.FC<SubmenuProviderProps> = ({
  children,
}) => {
  const [activeSubmenuId, setActiveSubmenu] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItem] = useState<string | null>(null);

  return (
    <SubmenuContext.Provider
      value={{
        activeSubmenuId,
        setActiveSubmenu,
        hoveredItemId,
        setHoveredItem,
      }}
    >
      {children}
    </SubmenuContext.Provider>
  );
};
