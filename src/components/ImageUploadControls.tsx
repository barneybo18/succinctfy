import React from 'react';

interface ImageUploadControlsProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  originalImageUrl: string | null;
  selectedColorName: string;
}

const ImageUploadControls: React.FC<ImageUploadControlsProps> = ({ onImageUpload, originalImageUrl, selectedColorName }) => {
  return (
    <>
      <input
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={onImageUpload}
        className={`block w-full text-sm text-slate-500 mb-4
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-${selectedColorName}-100 file:text-${selectedColorName}-700
                   hover:file:bg-${selectedColorName}-200 cursor-pointer`}
      />
      {originalImageUrl && (
        <div className="flex flex-col items-center mb-4">
          <h3 className={`text-lg font-medium text-${selectedColorName}-600 mb-2`}>Your Uploaded Image:</h3>
          <img src={originalImageUrl} alt="Original" className={`max-w-full h-48 object-contain border border-${selectedColorName}-200 rounded`} />
        </div>
      )}
    </>
  );
};

export default ImageUploadControls;