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
  selectedIconId: string | null;
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
  selectedIconId: null,
  wallpaper: 'bliss',
};

const desktopSlice = createSlice({
  name: 'desktop',
  initialState,
  reducers: {
    selectIcon: (state, action: PayloadAction<string | null>) => {
      state.selectedIconId = action.payload;
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

      const newIcons = createDesktopIconsFromFileSystem();

      // Restore positions for existing icons
      newIcons.forEach((icon) => {
        const existingPos = existingPositions.get(icon.id);
        if (existingPos) {
          icon.x = existingPos.x;
          icon.y = existingPos.y;
        }
      });

      state.icons = newIcons;

      // Clear selection if selected icon no longer exists
      if (
        state.selectedIconId &&
        !newIcons.find((icon) => icon.id === state.selectedIconId)
      ) {
        state.selectedIconId = null;
      }
    },
  },
});

export const {
  selectIcon,
  moveIcon,
  addIcon,
  removeIcon,
  setWallpaper,
  refreshDesktopFromFileSystem,
} = desktopSlice.actions;
export default desktopSlice.reducer;
