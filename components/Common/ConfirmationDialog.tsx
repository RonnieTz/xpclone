import React from 'react';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Dialog content */}
      <div className="flex-1 p-4 flex items-center">
        <div className="flex items-start space-x-3">
          {/* Warning icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-black font-bold text-lg">!</span>
            </div>
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm text-gray-800">{message}</p>
          </div>
        </div>
      </div>

      {/* Button area */}
      <div className="flex justify-end space-x-2 p-4 border-t border-gray-300">
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-gray-200 border border-gray-400 text-sm hover:bg-gray-300 focus:outline-none"
          style={{
            borderTopColor: '#ffffff',
            borderLeftColor: '#ffffff',
            borderRightColor: '#808080',
            borderBottomColor: '#808080',
          }}
        >
          {confirmText}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 border border-gray-400 text-sm hover:bg-gray-300 focus:outline-none"
          style={{
            borderTopColor: '#ffffff',
            borderLeftColor: '#ffffff',
            borderRightColor: '#808080',
            borderBottomColor: '#808080',
          }}
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
