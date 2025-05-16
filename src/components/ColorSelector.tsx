import React from 'react';
import type { ColorOption } from '../types';


interface ColorSelectorProps {
  colorOptions: ColorOption[];
  selectedColor: ColorOption;
  onColorSelect: (color: ColorOption) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colorOptions, selectedColor, onColorSelect }) => {
  return (
    <div className="w-full mt-4">
      <h3 className={`text-lg font-medium text-${selectedColor.name}-600 mb-2`}>Choose Team Color:</h3>
      <div className="flex justify-center space-x-2 m-2">
        {colorOptions.map(color => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color)}
            title={color.name}
            className={`w-10 h-10 rounded cursor-pointer transition-all duration-200 ${selectedColor.name === color.name ? 'ring-4 ring-gray-400' : ''}`}
            style={{ backgroundColor: color.bgColor }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;