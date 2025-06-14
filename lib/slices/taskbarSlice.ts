import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TaskbarItem {
  id: string;
  title: string;
  icon: string;
  isActive: boolean;
  isMinimized: boolean;
  windowId: string;
}

interface TaskbarState {
  items: TaskbarItem[];
  startButtonPressed: boolean;
  currentTime: string;
  notificationArea: {
    volume: boolean;
    network: boolean;
    battery?: number;
  };
}

const initialState: TaskbarState = {
  items: [],
  startButtonPressed: false,
  currentTime: '--:--', // Static placeholder to prevent hydration mismatch
  notificationArea: {
    volume: true,
    network: true,
  },
};

const taskbarSlice = createSlice({
  name: 'taskbar',
  initialState,
  reducers: {
    addTaskbarItem: (state, action: PayloadAction<TaskbarItem>) => {
      // Check if item already exists to prevent duplicates
      const existingItem = state.items.find(
        (item) => item.windowId === action.payload.windowId
      );
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    removeTaskbarItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.windowId !== action.payload
      );
    },
    syncTaskbarWithWindows: (state, action: PayloadAction<TaskbarItem[]>) => {
      // Replace all items with the new synchronized list
      state.items = action.payload;
    },
    setActiveItem: (state, action: PayloadAction<string>) => {
      state.items.forEach((item) => {
        item.isActive = item.windowId === action.payload;
      });
    },
    toggleStartButton: (state) => {
      state.startButtonPressed = !state.startButtonPressed;
    },
    setStartButtonPressed: (state, action: PayloadAction<boolean>) => {
      state.startButtonPressed = action.payload;
    },
    updateTime: (state, action: PayloadAction<string>) => {
      state.currentTime = action.payload;
    },
    updateNotificationArea: (
      state,
      action: PayloadAction<Partial<TaskbarState['notificationArea']>>
    ) => {
      state.notificationArea = { ...state.notificationArea, ...action.payload };
    },
  },
});

export const {
  addTaskbarItem,
  removeTaskbarItem,
  syncTaskbarWithWindows,
  setActiveItem,
  toggleStartButton,
  setStartButtonPressed,
  updateTime,
  updateNotificationArea,
} = taskbarSlice.actions;
export default taskbarSlice.reducer;
