'use client';

import React from 'react';
import Image from 'next/image';
import { TaskbarItem as TaskbarItemType } from '@/lib/slices/taskbarSlice';
import { getIconPath } from '@/lib/iconMapping';

interface TaskbarItemProps {
  item: TaskbarItemType;
  onClick: (windowId: string) => void;
}

const TaskbarItem: React.FC<TaskbarItemProps> = ({ item, onClick }) => {
  return (
    <button
      className={`flex items-center px-3 py-2 rounded-sm text-white truncate transition-all ${
        item.isActive && !item.isMinimized
          ? 'bg-blue-700'
          : 'bg-blue-600 hover:bg-blue-500'
      }`}
      onClick={() => onClick(item.windowId)}
      style={{
        height: '32px',
        marginTop: '3px',
        fontSize: '12px',
        width: '150px',
        minWidth: '150px',
        maxWidth: '150px',
        boxShadow:
          item.isActive && !item.isMinimized
            ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.4), inset -1px -1px 2px rgba(255, 255, 255, 0.1)'
            : 'inset 1px 1px 2px rgba(255, 255, 255, 0.3), inset -1px -1px 2px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Image
        src={`/${getIconPath(item.icon)}`}
        alt={item.title}
        width={16}
        height={16}
        className="mr-1 object-contain"
      />
      {item.title}
    </button>
  );
};

export default TaskbarItem;
