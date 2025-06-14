import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StartMenuItem {
  id: string;
  name: string;
  icon: string;
  type: 'application' | 'folder' | 'separator';
  action?: string;
  children?: StartMenuItem[];
}

interface StartMenuState {
  isOpen: boolean;
  hoveredItemId: string | null;
  programs: StartMenuItem[];
  recentDocuments: string[];
  userInfo: {
    username: string;
    avatar: string;
  };
}

const initialState: StartMenuState = {
  isOpen: false,
  hoveredItemId: null,
  programs: [
    {
      id: '1',
      name: 'Internet Explorer',
      icon: 'ie',
      type: 'application',
      action: 'open-browser',
    },
    {
      id: '2',
      name: 'Outlook Express',
      icon: 'outlook',
      type: 'application',
      action: 'open-email',
    },
    {
      id: '3',
      name: 'Windows Media Player',
      icon: 'wmp',
      type: 'application',
      action: 'open-media',
    },
    {
      id: '4',
      name: 'Windows Messenger',
      icon: 'messenger',
      type: 'application',
      action: 'open-messenger',
    },
    { id: 'sep1', name: '', icon: '', type: 'separator' },
    {
      id: '5',
      name: 'Accessories',
      icon: 'accessories',
      type: 'folder',
      children: [
        {
          id: '5-1',
          name: 'Calculator',
          icon: 'calc',
          type: 'application',
          action: 'open-calculator',
        },
        {
          id: '5-2',
          name: 'Notepad',
          icon: 'notepad',
          type: 'application',
          action: 'open-notepad',
        },
        {
          id: '5-3',
          name: 'Paint',
          icon: 'paint',
          type: 'application',
          action: 'open-paint',
        },
      ],
    },
    {
      id: '6',
      name: 'Games',
      icon: 'games',
      type: 'folder',
      children: [
        {
          id: '6-1',
          name: 'Solitaire',
          icon: 'solitaire',
          type: 'application',
          action: 'open-solitaire',
        },
        {
          id: '6-2',
          name: 'Minesweeper',
          icon: 'minesweeper',
          type: 'application',
          action: 'open-minesweeper',
        },
      ],
    },
  ],
  recentDocuments: [],
  userInfo: {
    username: 'User',
    avatar: 'default-avatar',
  },
};

const startMenuSlice = createSlice({
  name: 'startMenu',
  initialState,
  reducers: {
    toggleStartMenu: (state) => {
      state.isOpen = !state.isOpen;
      if (!state.isOpen) {
        state.hoveredItemId = null;
      }
    },
    setStartMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
      if (!action.payload) {
        state.hoveredItemId = null;
      }
    },
    setHoveredItem: (state, action: PayloadAction<string | null>) => {
      state.hoveredItemId = action.payload;
    },
    addRecentDocument: (state, action: PayloadAction<string>) => {
      if (!state.recentDocuments.includes(action.payload)) {
        state.recentDocuments.unshift(action.payload);
        if (state.recentDocuments.length > 10) {
          state.recentDocuments.pop();
        }
      }
    },
    clearRecentDocuments: (state) => {
      state.recentDocuments = [];
    },
    setUserInfo: (
      state,
      action: PayloadAction<Partial<StartMenuState['userInfo']>>
    ) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
  },
});

export const {
  toggleStartMenu,
  setStartMenuOpen,
  setHoveredItem,
  addRecentDocument,
  clearRecentDocuments,
  setUserInfo,
} = startMenuSlice.actions;
export default startMenuSlice.reducer;
