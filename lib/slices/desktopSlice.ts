import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDesktopItems, FileSystemItem } from '@/lib/filesystem';

export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  type: 'file' | 'folder' | 'application' | 'shortcut';
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

    let iconType: 'file' | 'folder' | 'application' | 'shortcut' = 'file';

    switch (item.type) {
      case 'folder':
        iconType = 'folder';
        break;
      case 'program':
        iconType = 'application';
        break;
      case 'shortcut':
        iconType = 'shortcut';
        break;
      default:
        iconType = 'file';
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
    refreshDesktopFromFileSystem: (state) => {
      // Keep existing positions for icons that still exist
      const existingPositions = new Map(
        state.icons.map((icon) => [icon.id, { x: icon.x, y: icon.y }])
      );

      // Check for pending drop position
      const pendingDropStr =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('pendingDropPosition')
          : null;
      const pendingDrop = pendingDropStr ? JSON.parse(pendingDropStr) : null;

      const newIcons = createDesktopIconsFromFileSystem();

      // Restore positions for existing icons
      newIcons.forEach((icon) => {
        const existingPos = existingPositions.get(icon.id);
        if (existingPos) {
          icon.x = existingPos.x;
          icon.y = existingPos.y;
        } else if (pendingDrop && icon.name === pendingDrop.name) {
          // Position new icon at drop coordinates
          icon.x = pendingDrop.x;
          icon.y = pendingDrop.y;

          // Clear the pending drop position
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('pendingDropPosition');
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
