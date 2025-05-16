import React, { useState, useCallback, useEffect } from 'react';
import ColorSelector from './components/ColorSelector';
import type { ColorOption } from './types';
import ImageUploadControls from './components/ImageUploadControls';
import EditedImagePreview from './components/EditedImagePreview';
import { generatePosterDataUrl } from './utils/imageGenerator';


const colorOptionsData: ColorOption[] = [
  { name: 'blue', bgColor: '#B6D0FF', heartColor: '#4A7AFF' },
  { name: 'pink', bgColor: '#FFB6C1', heartColor: '#FF4A7A' },
  { name: 'green', bgColor: '#B6FFD0', heartColor: '#4AFF7A' },
  { name: 'purple', bgColor: '#D0B6FF', heartColor: '#7A4AFF' },
  { name: 'orange', bgColor: '#FFD0B6', heartColor: '#FF7A4A' },
]

// Helper function to get the appropriate Tailwind class based on color name
const getColorClass = (colorName: string, element: string) => {
  const safeColorMap: Record<string, Record<string, string>> = {
    blue: {
      bg: 'bg-blue-100',
      bgLight: 'bg-blue-50',
      text: 'text-blue-700',
      textDark: 'text-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600',
      buttonDisabled: 'bg-blue-300',
      border: 'border-blue-200',
      progress: 'bg-blue-200',
      progressBar: 'bg-blue-600',
      file: 'file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200'
    },
    pink: {
      bg: 'bg-pink-100',
      bgLight: 'bg-pink-50',
      text: 'text-pink-700',
      textDark: 'text-pink-600',
      button: 'bg-pink-500 hover:bg-pink-600',
      buttonDisabled: 'bg-pink-300',
      border: 'border-pink-200',
      progress: 'bg-pink-200',
      progressBar: 'bg-pink-600',
      file: 'file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200'
    },
    green: {
      bg: 'bg-green-100',
      bgLight: 'bg-green-50',
      text: 'text-green-700',
      textDark: 'text-green-600',
      button: 'bg-green-500 hover:bg-green-600',
      buttonDisabled: 'bg-green-300',
      border: 'border-green-200',
      progress: 'bg-green-200',
      progressBar: 'bg-green-600',
      file: 'file:bg-green-100 file:text-green-700 hover:file:bg-green-200'
    },
    purple: {
      bg: 'bg-purple-100',
      bgLight: 'bg-purple-50',
      text: 'text-purple-700',
      textDark: 'text-purple-600',
      button: 'bg-purple-500 hover:bg-purple-600',
      buttonDisabled: 'bg-purple-300',
      border: 'border-purple-200',
      progress: 'bg-purple-200',
      progressBar: 'bg-purple-600',
      file: 'file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200'
    },
    orange: {
      bg: 'bg-orange-100',
      bgLight: 'bg-orange-50',
      text: 'text-orange-700',
      textDark: 'text-orange-600',
      button: 'bg-orange-500 hover:bg-orange-600',
      buttonDisabled: 'bg-orange-300',
      border: 'border-orange-200',
      progress: 'bg-orange-200',
      progressBar: 'bg-orange-600',
      file: 'file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200'
    }
  };

  // Default to pink if color not found
  const colorTheme = safeColorMap[colorName] || safeColorMap.pink;
  return colorTheme[element] || '';
};

const App = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null); 
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Combined loading state
  const [error, setError] = useState<string | null>(null);
  const [isBgRemoved, setIsBgRemoved] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [imageAfterBgRemovalUrl, setImageAfterBgRemovalUrl] = useState<string | null>(null);
  const [gpuImages, setGpuImages] = useState<Record<string, HTMLImageElement | null>>({});

  const colorOptions = colorOptionsData;
  
  // Set default selected color to pink (index 1)
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[1]);

  useEffect(() => {
    const loadGpuImages = async () => {
      const loadedGpus: Record<string, HTMLImageElement | null> = {};
      for (const color of colorOptions) {
        try {
          // Dynamically import GPU images (ensure these paths are correct and images are .jpeg)
          const gpuSrcModule = await import(`./assets/succinct_${color.name}_gpu.png`);
          const gpuImg = new Image();
          gpuImg.src = gpuSrcModule.default; // .default is needed for dynamic imports of images
          await new Promise<void>((resolveLoad, rejectLoad) => {
            gpuImg.onload = () => resolveLoad();
            gpuImg.onerror = (e) => rejectLoad(new Error(`Failed to load GPU for ${color.name}: ${e}`));
          });
          loadedGpus[color.name] = gpuImg;
        } catch (e) {
          console.error(`Error importing or loading GPU image for ${color.name}:`, e);
          loadedGpus[color.name] = null; // Mark as failed to load
        }
      }
      setGpuImages(loadedGpus);
    };
    loadGpuImages();

  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (originalImageUrl && originalImageUrl.startsWith('blob:')) URL.revokeObjectURL(originalImageUrl);
    if (imageAfterBgRemovalUrl && imageAfterBgRemovalUrl.startsWith('blob:')) URL.revokeObjectURL(imageAfterBgRemovalUrl);
    setError(null);
    setEditedImageUrl(null); // Clear previous edited image
    setIsBgRemoved(false); // Reset background removal status
    setImageAfterBgRemovalUrl(null);
    const file = event.target.files?.[0];
    if (file) {
      // Accept multiple image formats instead of just PNG
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only PNG, JPEG, GIF and WebP images are allowed.');
        setOriginalImageFile(null);
        setOriginalImageUrl(null);
        return;
      }
      setOriginalImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImageUrl(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setOriginalImageFile(null);
        setOriginalImageUrl(null);
      }
      reader.readAsDataURL(file);
    } else {
      setOriginalImageFile(null);
      setOriginalImageUrl(null);
    }
  };

  // Change selected color
  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    if (originalImageUrl) {
      // Regenerate the image with the new color
      handleEditImage(color);
    }
  };


  // This function generates the static poster image
  const handleEditImage = useCallback(async (colorToUse?: ColorOption) => {
    const baseImageUrl = isBgRemoved && imageAfterBgRemovalUrl ? imageAfterBgRemovalUrl : originalImageUrl;
    const finalColor = colorToUse || selectedColor;
    const currentGpuImage = gpuImages[finalColor.name];
    const currentUsername = username.trim();

    if (!baseImageUrl) {
      setError('Please upload an image first.');
      return;
    }
    if (!currentGpuImage && Object.keys(gpuImages).length > 0) { // Check if GPU images are loaded or still loading
        if (gpuImages[finalColor.name] === undefined) { // Still loading
            setError(`GPU image for ${finalColor.name} is still loading. Please wait.`);
        } else { // Failed to load
            setError(`GPU image for ${finalColor.name} failed to load. Cannot generate poster.`);
        }
        return;
    }
     if (!currentGpuImage) { // General catch-all if it's null for other reasons after loading attempt
        setError(`Required GPU image for ${finalColor.name} is not available.`);
        return;
    }
    if (!currentUsername) {
      setError('Username is required to generate the poster.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataUrl = await generatePosterDataUrl({
        baseImageUrl,
        finalColor,
        currentGpuImage,
        currentUsername,
      });
      setEditedImageUrl(dataUrl);
    } catch (err: any) {
      console.error("Error processing image:", err);
      setError(err.message || 'Failed to process the image.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageUrl, selectedColor, isBgRemoved, imageAfterBgRemovalUrl, gpuImages, username]);

  const handleDownloadImage = () => {
    if (!editedImageUrl) {
      setError('No image to download.');
      return;
    }

    // Convert data URL to Blob for potentially better download handling
    // and to ensure the filename is respected.
    fetch(editedImageUrl)
    .then(res => res.blob())
    .then(blob => {
      const originalFileName = originalImageFile?.name.split('.').slice(0, -1).join('.') || 'image';
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${originalFileName}_succinctified_${selectedColor.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up the object URL
      setIsLoading(false);
    })
    .catch(err => setError(`Download failed: ${err.message}`));
  };

  // Get color-specific classes for the current theme
  const colorName = selectedColor.name;

  return (
    <div className={getColorClass(colorName, 'bg') + " min-h-screen p-6 font-sans"}>
      <h1 className={`text-3xl md:text-4xl font-bold ${getColorClass(colorName, 'textDark')} text-center mb-8`}>
        Succinctify
      </h1>
      
      <p className={`text-center ${getColorClass(colorName, 'text')} mb-6`}>
        Upload an image,rep your team and create your {colorName} team poster!
      </p>

      {error && (
        <p className="text-red-600 text-center mb-4 bg-red-100 p-3 rounded-md">
          Error: {error}
        </p>
      )}

      <div className="flex flex-col md:flex-row justify-around items-start gap-8 mt-6">
        {/* --- Upload Card --- */}
        <div className={`${getColorClass(colorName, 'bgLight')} p-6 rounded-lg shadow-lg text-center w-full md:w-96 min-h-[500px] flex flex-col justify-between`}>
          <h2 className={`text-2xl font-semibold ${getColorClass(colorName, 'text')} mb-4`}>
            Upload Image
          </h2>
          <div className="flex flex-col items-center"> {/* Container for input and images */}
            <ImageUploadControls
              onImageUpload={handleImageUpload}
              originalImageUrl={originalImageUrl}
              selectedColorName={colorName} // Pass the color name for theming
            />
            
            {/* Username Input and Background Removal */}
            {originalImageFile && (
              <div className="w-full mt-4">
                <div className="mb-4">
                  <label htmlFor="username" className={`block text-sm font-medium ${getColorClass(colorName, 'text')} mb-1`}>
                    Username (Required)
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="YourCoolUsername"
                    className={`mt-1 block w-full px-3 py-2 ${getColorClass(colorName, 'bgLight')} border ${getColorClass(colorName, 'border')} rounded-md text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-${colorName}-500 focus:ring-1 focus:ring-${colorName}-500
                      ${getColorClass(colorName, 'text')}`}
                  />
                </div>
              </div>
            )}
            <ColorSelector
              colorOptions={colorOptions}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
          </div>
          {isLoading && (
            <div className={`${getColorClass(colorName, 'textDark')} mt-2`}>
              <p>Succinctifying your image 🌟</p>
              <div className={`w-full ${getColorClass(colorName, 'progress')} rounded-full h-2.5 my-2`}>
                <div className={`${getColorClass(colorName, 'progressBar')} h-2.5 rounded-full animate-pulse`} style={{width: '100%'}}></div>
              </div>
            </div>
          )}
          <button
            onClick={() => handleEditImage()}
            disabled={!originalImageFile || !username.trim() || isLoading}
            className={`${getColorClass(colorName, 'button')} text-white py-2 px-4 rounded-md cursor-pointer transition-colors mt-auto w-full disabled:${getColorClass(colorName, 'buttonDisabled')} disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Repping...' : 'Rep Your team'}
          </button>
        </div>

        {/* --- Edited Image Card --- */}
        <div className={`${getColorClass(colorName, 'bgLight')} p-6 rounded-lg shadow-lg text-center w-full md:w-96 min-h-[300px] flex flex-col justify-between items-center`}>
          <h2 className={`text-2xl font-semibold ${getColorClass(colorName, 'text')} mb-4`}>
            Succinctified Image
          </h2>
          <EditedImagePreview
            editedImageUrl={editedImageUrl}
            selectedColorName={colorName}
            onDownloadImage={handleDownloadImage}
            getColorClass={getColorClass} // Pass the getColorClass function
          />
        </div>
      </div>

      {/* Footer */}
      <footer className={`text-center py-8 mt-12 ${getColorClass(colorName, 'text')}`}>
        <p className="text-sm">
          Made with ❤️ by Banny - Follow me on Twitter: {' '}
          <a href="https://twitter.com/oboh_banny18" target="_blank" rel="noopener noreferrer" className={`${getColorClass(colorName, 'textDark')} hover:underline font-semibold`}>
            @oboh_banny18
          </a>
        </p>
        </footer>
    </div>
  );
};

export default App;