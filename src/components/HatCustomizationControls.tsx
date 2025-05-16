import React from 'react';

interface HatCustomizationControlsProps {
  hatScale: number;
  onHatScaleChange: (value: number) => void;
  hatOffsetX: number;
  onHatOffsetXChange: (value: number) => void;
  hatOffsetY: number;
  onHatOffsetYChange: (value: number) => void;
  selectedColorName: string;
  triggerEdit: () => void;
}

const HatCustomizationControls: React.FC<HatCustomizationControlsProps> = ({
  hatScale, onHatScaleChange,
  hatOffsetX, onHatOffsetXChange,
  hatOffsetY, onHatOffsetYChange,
  selectedColorName, triggerEdit
}) => {
  return (
    <div className="w-full mt-4 border-t pt-4">
      <h3 className={`text-lg font-medium text-${selectedColorName}-600 mb-2`}>Customize Hat:</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <label htmlFor="hatScale" className="block">Scale: {hatScale.toFixed(2)}</label>
          <input type="range" id="hatScale" min="0.1" max="1.5" step="0.05" value={hatScale} onChange={(e) => { onHatScaleChange(parseFloat(e.target.value)); triggerEdit(); }} className="w-full" />
        </div>
        <div>
          <label htmlFor="hatOffsetX" className="block">X Offset: {hatOffsetX}</label>
          <input type="range" id="hatOffsetX" min="-100" max="100" step="5" value={hatOffsetX} onChange={(e) => { onHatOffsetXChange(parseInt(e.target.value)); triggerEdit(); }} className="w-full" />
        </div>
        <div>
          <label htmlFor="hatOffsetY" className="block">Y Offset: {hatOffsetY}</label>
          <input type="range" id="hatOffsetY" min="-300" max="100" step="5" value={hatOffsetY} onChange={(e) => { onHatOffsetYChange(parseInt(e.target.value)); triggerEdit(); }} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default HatCustomizationControls;