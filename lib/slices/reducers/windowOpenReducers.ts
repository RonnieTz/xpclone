import { PayloadAction } from '@reduxjs/toolkit';
import { WindowsState, CreateWindowPayload } from '../types/windowTypes';
import {
  deactivateAllWindows,
  findWindowByContent,
} from '../utils/windowUtils';
import { calculateModalPosition } from '../utils/modalUtils';

export const openWindowReducer = (
  state: WindowsState,
  action: PayloadAction<CreateWindowPayload>
) => {
  const id = Date.now().toString();
  const newWindow = {
    ...action.payload,
    id,
    zIndex: state.nextZIndex,
    isActive: true,
  };

  // Deactivate all other windows
  deactivateAllWindows(state.windows);

  state.windows.push(newWindow);
  state.activeWindowId = id;
  state.nextZIndex += 1;
};

export const openOrFocusWindowReducer = (
  state: WindowsState,
  action: PayloadAction<CreateWindowPayload>
) => {
  // Check if a window with the same content already exists
  const existingWindow = findWindowByContent(
    state.windows,
    action.payload.content
  );

  if (existingWindow) {
    // Focus the existing window instead of opening a new one
    deactivateAllWindows(state.windows);

    // Activate and bring to front
    existingWindow.isActive = true;
    existingWindow.zIndex = state.nextZIndex;
    state.activeWindowId = existingWindow.id;
    state.nextZIndex += 1;

    // Restore if minimized
    if (existingWindow.isMinimized) {
      existingWindow.isMinimized = false;
      existingWindow.isRestoreAnimating = true;
    }
  } else {
    // No existing window found, create a new one
    openWindowReducer(state, action);
  }
};

export const openModalWindowReducer = (
  state: WindowsState,
  action: PayloadAction<CreateWindowPayload & { parentWindowId: string }>
) => {
  const { parentWindowId, ...windowPayload } = action.payload;
  const parentWindow = state.windows.find((w) => w.id === parentWindowId);

  if (!parentWindow) {
    console.warn(`Parent window ${parentWindowId} not found for modal`);
    return;
  }

  const id = Date.now().toString();
  const overlayId = `${id}-overlay`;

  // Calculate modal position relative to parent
  const modalPosition = calculateModalPosition(
    parentWindow,
    windowPayload.width,
    windowPayload.height
  );

  const newModal = {
    ...windowPayload,
    id,
    x: modalPosition.x,
    y: modalPosition.y,
    zIndex: state.nextZIndex,
    isActive: true,
    isModal: true,
    parentWindowId,
    modalOverlayId: overlayId,
    isResizable: windowPayload.isResizable ?? false, // Modals typically not resizable
  };

  // Deactivate all other windows
  deactivateAllWindows(state.windows);

  state.windows.push(newModal);
  state.activeWindowId = id;
  state.nextZIndex += 2; // Reserve space for overlay
};

export const closeModalWindowReducer = (
  state: WindowsState,
  action: PayloadAction<string>
) => {
  const modalId = action.payload;
  const modalWindow = state.windows.find((w) => w.id === modalId);

  if (!modalWindow || !modalWindow.isModal) {
    return;
  }

  // Remove the modal window
  state.windows = state.windows.filter((w) => w.id !== modalId);

  // If this was the active window, focus the parent
  if (state.activeWindowId === modalId && modalWindow.parentWindowId) {
    const parentWindow = state.windows.find(
      (w) => w.id === modalWindow.parentWindowId
    );
    if (parentWindow) {
      deactivateAllWindows(state.windows);
      parentWindow.isActive = true;
      state.activeWindowId = parentWindow.id;
    } else {
      state.activeWindowId = null;
    }
  }
};
