import { useState, useRef, useEffect } from 'react';
import { DropdownPosition } from './types';

export const useDropdownMenu = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    x: 0,
    y: 0,
  });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (item: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (activeDropdown === item) {
      setActiveDropdown(null);
    } else {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const toolbarRect = toolbarRef.current?.getBoundingClientRect();

      if (toolbarRect) {
        setDropdownPosition({
          x: rect.left - toolbarRect.left,
          y: rect.bottom - toolbarRect.top,
        });
      }

      setActiveDropdown(item);
    }
  };

  const handleItemHover = (item: string, event: React.MouseEvent) => {
    if (activeDropdown && activeDropdown !== item) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const toolbarRect = toolbarRef.current?.getBoundingClientRect();

      if (toolbarRect) {
        setDropdownPosition({
          x: rect.left - toolbarRect.left,
          y: rect.bottom - toolbarRect.top,
        });
      }

      setActiveDropdown(item);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isToolbarItemClick =
        target instanceof Element && target.closest('[data-toolbar-item]');
      const isDropdownClick =
        target instanceof Element && target.closest('[data-dropdown]');

      if (!isToolbarItemClick && !isDropdownClick) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return {
    activeDropdown,
    dropdownPosition,
    toolbarRef,
    handleItemClick,
    handleItemHover,
    setActiveDropdown,
  };
};
