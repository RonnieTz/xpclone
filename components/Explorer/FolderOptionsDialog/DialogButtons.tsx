import React from 'react';

interface DialogButtonsProps {
  onRestoreDefaults: () => void;
  onClose: () => void;
}

export const DialogButtons: React.FC<DialogButtonsProps> = ({
  onRestoreDefaults,
  onClose,
}) => (
  <div className="flex justify-end space-x-2 px-4 pb-4">
    <button
      onClick={onRestoreDefaults}
      className="px-4 py-1 border border-gray-400 bg-gray-200 hover:bg-gray-300 text-sm"
      style={{
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#808080',
        borderBottomColor: '#808080',
      }}
    >
      Restore Defaults
    </button>
    <button
      onClick={onClose}
      className="px-4 py-1 border border-gray-400 bg-gray-200 hover:bg-gray-300 text-sm"
      style={{
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#808080',
        borderBottomColor: '#808080',
      }}
    >
      OK
    </button>
  </div>
);
