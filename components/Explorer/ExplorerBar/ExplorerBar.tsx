'use client';

import React from 'react';
import { ExplorerBarState } from '../types';
import DefaultView from './DefaultView';
import SearchView from './SearchView/SearchView';
import FavoritesView from './FavoritesView/FavoritesView';
import HistoryView from './HistoryView/HistoryView';
import FoldersView from './FoldersView/FoldersView';

// Using object type instead of empty interface
interface ExplorerBarProps {
  className?: string;
  currentState: ExplorerBarState;
}

const ExplorerBar: React.FC<ExplorerBarProps> = ({
  className,
  currentState,
}) => {
  const renderView = () => {
    switch (currentState) {
      case 'Default':
        return <DefaultView />;
      case 'Search':
        return <SearchView />;
      case 'Favorites':
        return <FavoritesView />;
      case 'History':
        return <HistoryView />;
      case 'Folders':
        return <FoldersView />;
      default:
        return <DefaultView />;
    }
  };

  return (
    <div
      className={`w-48 border-r border-gray-300 flex flex-col ${
        className || ''
      }`}
    >
      <div className="flex-1">{renderView()}</div>
    </div>
  );
};

export default ExplorerBar;
