import React, { useState, useRef, useEffect } from 'react';

interface EditedImagePreviewProps {
  editedImageUrl: string | null;
  selectedColorName: string;
  onDownloadImage: () => void;
  getColorClass: (colorName: string, element: string) => string;
}

const EditedImagePreview: React.FC<EditedImagePreviewProps> = ({
  editedImageUrl,
  selectedColorName,
  onDownloadImage,
  getColorClass,
}) => {
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [shareMethod, setShareMethod] = useState<'native' | 'twitter'>('native');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Check what sharing capabilities are available
  useEffect(() => {
    // Default to Twitter method on desktop browsers
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setShareMethod(isMobile ? 'native' : 'twitter');
  }, []);

  // Convert data URL to File object
  const dataURLtoFile = (dataURL: string, filename: string): File => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  };

  // Handle standard share button click
  const handleShare = async () => {
    if (!editedImageUrl) return;
    
    const capitalizedColorName = selectedColorName.charAt(0).toUpperCase() + selectedColorName.slice(1);
    const appUrl = "https://succinctfy.vercel.app/";
    const shareText = `My @succinctlabs Stage 2 poster is ready! Team ${capitalizedColorName} all the way! 🚀 Can't wait to #provewithsuccinct. What does yours look like? Want to make your own? Check here: ${appUrl}`;
    
    if (shareMethod === 'native') {
      await nativeShare(shareText, capitalizedColorName);
    } else {
      await twitterShare(shareText);
    }
  };

  // Native sharing functionality (mobile-friendly)
  const nativeShare = async (shareText: string, capitalizedColorName: string) => {
    try {
      const filename = `team_${capitalizedColorName}_poster_${Date.now()}.png`;
      const file = dataURLtoFile(editedImageUrl!, filename);
      
      // First try Web Share API with file
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Team ${capitalizedColorName} Poster`,
          text: shareText,
          files: [file]
        });
        setShowMessage("Poster shared successfully!");
        return;
      }
      
      // If Web Share API with files fails, try alternate approach
      setShareMethod('twitter');
      twitterShare(shareText);
    } catch (error) {
      console.error("Error sharing:", error);
      setShareMethod('twitter');
      twitterShare(shareText);
    }
  };

  // Twitter-specific sharing with media upload
  const twitterShare = async (shareText: string) => {
    // First download the image locally for the user
    onDownloadImage();
    
    // Option 1: Twitter Intent URL (requires manual attachment)
    const encodedTweetText = encodeURIComponent(shareText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    
    setShowMessage("Image downloaded! Please attach it to your tweet.");
    
    setTimeout(() => {
      setShowMessage(null);
    }, 7000);
  };

  // Switch sharing method
  // const toggleShareMethod = () => {
  //   setShareMethod(prev => prev === 'native' ? 'twitter' : 'native');
  // };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      {editedImageUrl ? (
        <img
          src={editedImageUrl}
          alt="Edited team poster"
          className={`max-w-full max-h-[350px] md:max-h-[400px] object-contain rounded-md border-2 ${getColorClass(
            selectedColorName,
            'border'
          )} mb-4`}
        />
      ) : (
        <div
          className={`w-full h-[350px] md:h-[400px] ${getColorClass(
            selectedColorName,
            'bg'
          )} border-2 ${getColorClass(
            selectedColorName,
            'border'
          )} rounded-md flex items-center justify-center mb-4`}
        >
          <p className={`${getColorClass(selectedColorName, 'text')}`}>
            Your generated poster will appear here.
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
        <button
          onClick={onDownloadImage}
          disabled={!editedImageUrl}
          className={`w-full ${getColorClass(selectedColorName, 'button')} text-white py-2 px-4 rounded-md cursor-pointer transition-colors disabled:${getColorClass(selectedColorName, 'buttonDisabled')} disabled:cursor-not-allowed`}
        >
          Download Image
        </button>
        
        <button
          onClick={handleShare}
          disabled={!editedImageUrl}
          className={`relative w-full ${getColorClass(selectedColorName, 'button')} text-white py-2 px-4 rounded-md cursor-pointer transition-colors disabled:${getColorClass(selectedColorName, 'buttonDisabled')} disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          {shareMethod === 'native' ? (
            <>
              <span>Share</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
              </svg>
            </>
          ) : (
            <>
              <span>Share to Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </>
          )}
        </button>
      </div>
      
      {showMessage && (
        <div 
          className={`mt-3 p-2 text-sm rounded-md ${getColorClass(selectedColorName, 'bgLight')} ${getColorClass(selectedColorName, 'text')} flex items-center gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="flex-shrink-0">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
          </svg>
          <span>{showMessage}</span>
        </div>
      )}

      {/* Hidden file input for future expansion */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
      />
      
      {/* Hidden form for potential server-side sharing approach */}
      <form 
        ref={formRef} 
        style={{ display: 'none' }} 
        method="post" 
        target="_blank"
      />
    </div>
  );
};

export default EditedImagePreview;