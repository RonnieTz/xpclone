import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { WindowState } from '@/lib/slices/types/windowTypes';
import {
  isWindowDisabled,
  getModalChildren,
  getTopmostModal,
} from '@/lib/slices/utils/modalUtils';

export const useModalWindow = (window: WindowState) => {
  const { windows } = useSelector((state: RootState) => state.windows);

  // Check if this window is disabled due to modal children
  const isDisabled = isWindowDisabled(window.id, windows);

  // Get modal children of this window
  const modalChildren = getModalChildren(window.id, windows);

  // Get the topmost modal child
  const topmostModal = getTopmostModal(window.id, windows);

  // Check if this window is a modal
  const isModal = Boolean(window.isModal);

  // Get parent window if this is a modal
  const parentWindow = window.parentWindowId
    ? windows.find((w) => w.id === window.parentWindowId)
    : null;

  // Check if modal should be shown on taskbar (modals typically don't appear)
  const shouldShowOnTaskbar = !isModal;

  // Check if window should accept focus
  const canReceiveFocus = !isDisabled;

  return {
    isDisabled,
    isModal,
    parentWindow,
    modalChildren,
    topmostModal,
    shouldShowOnTaskbar,
    canReceiveFocus,
  };
};
