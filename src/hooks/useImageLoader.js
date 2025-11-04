import { useState, useEffect } from 'react';

// Hook personalizado para manejo eficiente de imágenes
export const useImageLoader = (src, fallback) => {
  const [imageSrc, setImageSrc] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
      setError(false);
    };
    
    img.onerror = () => {
      setImageSrc(fallback);
      setLoading(false);
      setError(true);
    };
    
    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);

  return { imageSrc, loading, error };
};

// Imagen placeholder optimizada como SVG en Base64
export const BOOK_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2IiBzdHJva2U9IiNFNUU3RUIiLz4KPHA+YXRoIGQ9Ik00MCA2MEg4MFY2NEg0MFY2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA3MEg4MFY3NEg0MFY3MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA4MEg3MFY4NEg0MFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00NSA0NUg3NVY1NUg0NVY0NVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";

export default useImageLoader;