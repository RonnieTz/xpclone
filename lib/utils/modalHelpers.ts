import { Dispatch } from '@reduxjs/toolkit';
import { openModalWindow, closeModalWindow } from '@/lib/slices/windowsSlice';

interface ModalOptions {
  title: string;
  content: string;
  width?: number;
  height?: number;
  isResizable?: boolean;
  icon?: string;
}

/**
 * Opens a modal window bound to a parent window
 */
export const openModal = (
  dispatch: Dispatch,
  parentWindowId: string,
  options: ModalOptions
) => {
  const {
    title,
    content,
    width = 400,
    height = 200,
    isResizable = false,
    icon = 'Alert.png',
  } = options;

  dispatch(
    openModalWindow({
      parentWindowId,
      title,
      content,
      icon,
      x: 0, // Will be calculated by the reducer
      y: 0, // Will be calculated by the reducer
      width,
      height,
      isMinimized: false,
      isMaximized: false,
      isResizable,
    })
  );
};

// Modal callback registry to handle functions that can't be serialized
const modalCallbacks = new Map<
  string,
  {
    onConfirm?: () => void;
    onCancel?: () => void;
  }
>();

export const registerModalCallbacks = (
  modalId: string,
  callbacks: { onConfirm?: () => void; onCancel?: () => void }
) => {
  modalCallbacks.set(modalId, callbacks);
};

export const getModalCallbacks = (modalId: string) => {
  return modalCallbacks.get(modalId);
};

export const clearModalCallbacks = (modalId: string) => {
  modalCallbacks.delete(modalId);
};

/**
 * Opens a confirmation dialog modal
 */
export const openConfirmationDialog = (
  dispatch: Dispatch,
  parentWindowId: string,
  options: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
  }
) => {
  const modalId = Date.now().toString();

  // Store callbacks in registry
  registerModalCallbacks(modalId, {
    onConfirm: options.onConfirm,
    onCancel: options.onCancel,
  });

  const dialogData = JSON.stringify({
    type: 'confirmation',
    modalId,
    title: options.title,
    message: options.message,
    confirmText: options.confirmText,
    cancelText: options.cancelText,
  });

  openModal(dispatch, parentWindowId, {
    title: options.title,
    content: `Modal: ${dialogData}`,
    width: 400,
    height: 150,
    icon: 'Alert.png',
  });
};

/**
 * Closes a modal window
 */
export const closeModal = (dispatch: Dispatch, modalWindowId: string) => {
  dispatch(closeModalWindow(modalWindowId));
};
