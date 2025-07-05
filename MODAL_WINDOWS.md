# Modal Window Feature

This implementation adds modal window functionality to the Windows XP clone, allowing windows to open modal dialogs that block interaction with their parent windows.

## Features

- **Modal Windows**: Windows that are bound to a parent window and block interaction with it
- **Visual Overlay**: Semi-transparent overlay that covers the parent window when modal is open
- **No Taskbar Items**: Modal windows don't appear in the taskbar
- **Restricted Actions**: Modal windows cannot be minimized or maximized
- **Auto-positioning**: Modal windows are automatically centered relative to their parent
- **Focus Management**: Modal windows maintain focus and return focus to parent when closed

## Usage

### Opening a Simple Modal

```typescript
import { useDispatch } from 'react-redux';
import { openModal } from '@/lib/utils/modalHelpers';

const dispatch = useDispatch();

// Open a basic modal
openModal(dispatch, parentWindowId, {
  title: 'My Modal',
  content: 'This is modal content',
  width: 400,
  height: 200,
  icon: 'Alert.png',
});
```

### Opening a Confirmation Dialog

```typescript
import { openConfirmationDialog } from '@/lib/utils/modalHelpers';

openConfirmationDialog(dispatch, parentWindowId, {
  title: 'Confirm Delete',
  message: 'Are you sure you want to delete this file?',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  onConfirm: () => {
    // Handle confirmation
  },
  onCancel: () => {
    // Handle cancellation
  },
});
```

### Demonstration

To see the modal window in action:

1. Open an Explorer window (double-click My Computer)
2. Click on the "File" menu
3. Click "Delete" to see a confirmation dialog modal

## Technical Implementation

- **WindowState Interface**: Extended with `isModal`, `parentWindowId`, and `modalOverlayId`
- **Modal Utilities**: Helper functions in `modalUtils.ts` for managing modal state
- **Modal Overlay**: Component that renders behind modal windows to block interaction
- **Focus Management**: Hook `useModalWindow` manages modal-specific behavior
- **Taskbar Integration**: Modal windows are excluded from taskbar items

## File Structure

```
components/Window/
├── ModalOverlay.tsx          # Overlay component for blocking interaction
├── useModalWindow.ts         # Hook for modal window behavior
└── Window.tsx                # Updated to support modal rendering

lib/slices/
├── types/windowTypes.ts      # Extended WindowState interface
├── utils/modalUtils.ts       # Modal utility functions
└── reducers/windowOpenReducers.ts # Modal window reducers

lib/utils/
└── modalHelpers.ts           # Helper functions for opening modals

components/Common/
└── ConfirmationDialog.tsx    # Reusable confirmation dialog component
```

All files are kept under 200 lines as requested.
