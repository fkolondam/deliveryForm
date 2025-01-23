import { ref } from 'vue';

export function usePhotoWithMetadata() {
  const addWatermark = async (imageDataUrl, metadata) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Add watermark background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(10, canvas.height - 60, canvas.width - 20, 50);
        
        // Add metadata text
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        
        const timestamp = new Date().toLocaleString('id-ID');
        const location = metadata.coords ? 
          `${metadata.coords.latitude.toFixed(6)}°, ${metadata.coords.longitude.toFixed(6)}°` :
          'Location not available';
        
        ctx.fillText(`Timestamp: ${timestamp}`, 20, canvas.height - 40);
        ctx.fillText(`Location: ${location}`, 20, canvas.height - 20);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = imageDataUrl;
    });
  };

  return {
    addWatermark
  };
}
