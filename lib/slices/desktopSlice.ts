import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDesktopItems, FileSystemItem } from '@/lib/filesystem';
import { RootState } from '@/lib/store';
import { removePendingDesktopPosition } from './pendingPositionsSlice';

export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  type: 'file' | 'folder' | 'application' | 'shortcut' | 'program' | 'image' | 'sound' | 'drive';
  fileSystemItem?: FileSystemItem; // Reference to the actual filesystem item
}

interface DesktopState {
  icons: DesktopIcon[];
  selectedIconIds: string[]; // Changed from selectedIconId to support multiple selection
  wallpaper: string;
}

// Convert filesystem items to desktop icons with positions
function createDesktopIconsFromFileSystem(): DesktopIcon[] {
  const desktopItems = getDesktopItems();
  const icons: DesktopIcon[] = [];

  desktopItems.forEach((item, index) => {
    // Calculate position in a grid layout
    const col = Math.floor(index / 8); // 8 icons per column
    const row = index % 8;
    const x = col * 100;
    const y = row * 80;

    // Map filesystem types to desktop icon types
    let iconType: 'file' | 'folder' | 'application' | 'shortcut' | 'program' | 'image' | 'sound' | 'drive' = item.type;

    // Handle special mapping for 'program' to 'application' if needed for backwards compatibility
    if (item.type === 'program') {
      iconType = 'application';
    }

    icons.push({
      id: item.id,
      name: item.name,
      icon: item.icon || getDefaultIcon(item.type),
      x,
      y,
      type: iconType,
      fileSystemItem: item,
    });
  });

  return icons;
}

function getDefaultIcon(type: string): string {
  switch (type) {
    case 'folder':
      return 'folder';
    case 'file':
      return 'text-file';
    case 'program':
      return 'application';
    case 'shortcut':
      return 'shortcut';
    case 'image':
      return 'image-file';
    case 'sound':
      return 'sound-file';
    default:
      return 'file';
  }
}

const initialState: DesktopState = {
  icons: createDesktopIconsFromFileSystem(),
  selectedIconIds: [], // Changed from selectedIconId: null
  wallpaper: 'bliss',
};

// Async thunk to refresh desktop with pending positions from Redux
export const refreshDesktopWithPendingPositions = createAsyncThunk(
  'desktop/refreshWithPendingPositions',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const pendingDesktopPositions = state.pendingPositions.desktopPositions;

    // Dispatch the refresh action with pending positions
    dispatch(refreshDesktopFromFileSystem({ pendingDesktopPositions }));

    // Clear the processed pending positions
    Object.keys(pendingDesktopPositions).forEach((key) => {
      dispatch(removePendingDesktopPosition(key));
    });
  }
);

const desktopSlice = createSlice({
  name: 'desktop',
  initialState,
  reducers: {
    selectIcon: (state, action: PayloadAction<string | null>) => {
      // Single select - clear all and select one or clear all
      state.selectedIconIds = action.payload ? [action.payload] : [];
    },
    selectMultipleIcons: (state, action: PayloadAction<string[]>) => {
      // Set multiple selected icons
      state.selectedIconIds = action.payload;
    },
    addToSelection: (state, action: PayloadAction<string>) => {
      // Add icon to selection if not already selected
      if (!state.selectedIconIds.includes(action.payload)) {
        state.selectedIconIds.push(action.payload);
      }
    },
    removeFromSelection: (state, action: PayloadAction<string>) => {
      // Remove icon from selection
      state.selectedIconIds = state.selectedIconIds.filter(
        (id) => id !== action.payload
      );
    },
    setFocusIcon: (state, action: PayloadAction<string>) => {
      // Set focus without clearing selection - just ensure the icon is selected
      if (!state.selectedIconIds.includes(action.payload)) {
        state.selectedIconIds.push(action.payload);
      }
      // Move the focused icon to the end of the array to make it the "primary" selection
      const filteredIds = state.selectedIconIds.filter(
        (id) => id !== action.payload
      );
      state.selectedIconIds = [...filteredIds, action.payload];
    },
    toggleIconSelection: (state, action: PayloadAction<string>) => {
      // Toggle icon selection (for Ctrl+click)
      const iconId = action.payload;
      if (state.selectedIconIds.includes(iconId)) {
        state.selectedIconIds = state.selectedIconIds.filter(
          (id) => id !== iconId
        );
      } else {
        state.selectedIconIds.push(iconId);
      }
    },
    clearSelection: (state) => {
      // Clear all selected icons
      state.selectedIconIds = [];
    },
    moveIcon: (
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>
    ) => {
      const icon = state.icons.find((icon) => icon.id === action.payload.id);
      if (icon) {
        icon.x = action.payload.x;
        icon.y = action.payload.y;
      }
    },
    addIcon: (state, action: PayloadAction<DesktopIcon>) => {
      state.icons.push(action.payload);
    },
    removeIcon: (state, action: PayloadAction<string>) => {
      state.icons = state.icons.filter((icon) => icon.id !== action.payload);
    },
    setWallpaper: (state, action: PayloadAction<string>) => {
      state.wallpaper = action.payload;
    },
    refreshDesktopFromFileSystem: (
      state,
      action: PayloadAction<{
        pendingDesktopPositions?: Record<
          string,
          { name: string; id: string; x: number; y: number }
        >;
      }>
    ) => {
      // Keep existing positions for icons that still exist
      const existingPositions = new Map(
        state.icons.map((icon) => [icon.id, { x: icon.x, y: icon.y }])
      );

      // Get pending drop positions from the action payload (passed from thunk)
      const pendingDesktopPositions =
        action.payload?.pendingDesktopPositions || {};
      const allPendingDrops = Object.entries(pendingDesktopPositions).map(
        ([, data]) => ({ data })
      );

      const newIcons = createDesktopIconsFromFileSystem();

      // Restore positions for existing icons
      newIcons.forEach((icon) => {
        const existingPos = existingPositions.get(icon.id);
        if (existingPos) {
          icon.x = existingPos.x;
          icon.y = existingPos.y;
        } else {
          // Check all pending drops for this icon
          for (const { data: pendingDrop } of allPendingDrops) {
            const nameMatch =
              icon.name === pendingDrop.name ||
              icon.name.toLowerCase() === pendingDrop.name.toLowerCase() ||
              icon.fileSystemItem?.name === pendingDrop.name ||
              icon.fileSystemItem?.name?.toLowerCase() ===
                pendingDrop.name.toLowerCase();
            const idMatch =
              icon.id === pendingDrop.id ||
              icon.fileSystemItem?.id === pendingDrop.id;

            if (nameMatch || idMatch) {
              // Position new icon at drop coordinates
              icon.x = pendingDrop.x;
              icon.y = pendingDrop.y;
              break; // Found a match, stop checking other pending drops for this icon
            }
          }
        }
      });

      state.icons = newIcons;

      // Clear selection if selected icons no longer exist
      const existingIconIds = new Set(newIcons.map((icon) => icon.id));
      state.selectedIconIds = state.selectedIconIds.filter((id) =>
        existingIconIds.has(id)
      );
    },
  },
});

export const {
  selectIcon,
  selectMultipleIcons,
  addToSelection,
  removeFromSelection,
  setFocusIcon,
  toggleIconSelection,
  clearSelection,
  moveIcon,
  addIcon,
  removeIcon,
  setWallpaper,
  refreshDesktopFromFileSystem,
} = desktopSlice.actions;
export default desktopSlice.reducer;
