import React from 'react';

interface BackgroundRemovalControlsProps {
  removeBgApiKey: string;
  onRemoveBgApiKeyChange: (value: string) => void;
  onRemoveBackground: () => Promise<void>;
  isLoading: boolean;
  isBgRemoved: boolean;
  selectedColorName: string;
}

const BackgroundRemovalControls: React.FC<BackgroundRemovalControlsProps> = ({
  removeBgApiKey, onRemoveBgApiKeyChange,
  onRemoveBackground, isLoading, isBgRemoved, selectedColorName
}) => {
  return (
    <div className="w-full mt-4 border-t pt-4">
      <h3 className={`text-lg font-medium text-${selectedColorName}-600 mb-2`}>Background Options:</h3>
      <input
        type="text"
        placeholder="remove.bg API Key (Optional)"
        value={removeBgApiKey}
        onChange={(e) => onRemoveBgApiKeyChange(e.target.value)}
        className={`w-full p-2 border rounded mb-2 text-sm border-${selectedColorName}-300`}
      />
      <button onClick={onRemoveBackground} disabled={isLoading || !removeBgApiKey} className={`w-full bg-teal-500 text-white py-1 px-3 rounded text-sm hover:bg-teal-600 disabled:bg-gray-300`}>Remove Background & Apply Color</button>
      {isBgRemoved && <p className="text-green-600 text-xs mt-1">Background removed! Color applied.</p>}
    </div>
  );
};

export default BackgroundRemovalControls;