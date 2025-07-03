import React from 'react';

interface EmptyFolderStateProps {
  className?: string;
}

const EmptyFolderState: React.FC<EmptyFolderStateProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <p className="text-gray-500 text-center mt-8">This folder is empty.</p>
    </div>
  );
};

export default EmptyFolderState;
