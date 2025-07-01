export interface WindowState {
  id: string;
  title: string;
  content: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  isResizable: boolean;
  zIndex: number;
  // Store previous state for smooth animations
  previousX?: number;
  previousY?: number;
  previousWidth?: number;
  previousHeight?: number;
  isAnimating?: boolean;
  // Taskbar animation properties
  taskbarAnimationTarget?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isMinimizeAnimating?: boolean;
  isRestoreAnimating?: boolean;
  refreshCounter?: number; // Added refresh counter
}

export interface WindowsState {
  windows: WindowState[];
  nextZIndex: number;
  activeWindowId: string | null;
}

export type CreateWindowPayload = Omit<
  WindowState,
  'id' | 'zIndex' | 'isActive'
>;
export type WindowPositionPayload = { id: string; x: number; y: number };
export type WindowSizePayload = { id: string; width: number; height: number };
export type WindowAnimationPayload = { id: string; isAnimating: boolean };
export type WindowContentPayload = {
  id: string;
  title: string;
  content: string;
};
export type TaskbarAnimationPayload = {
  id: string;
  target: { x: number; y: number; width: number; height: number };
};
