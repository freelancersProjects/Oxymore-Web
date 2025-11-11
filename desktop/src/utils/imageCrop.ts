export const cropImage = (
  base64Image: string,
  containerWidth: number,
  containerHeight: number,
  position: { x: number; y: number },
  scale: number,
  type: 'avatar' | 'banner' = 'avatar'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const cropWidth = containerWidth;
      const cropHeight = containerHeight;

      const sourceWidth = img.width;
      const sourceHeight = img.height;

      const scaledWidth = sourceWidth * scale;
      const scaledHeight = sourceHeight * scale;

      const containerCenterX = cropWidth / 2;
      const containerCenterY = cropHeight / 2;

      const imageCenterX = containerCenterX + position.x;
      const imageCenterY = containerCenterY + position.y;

      const imageTopLeftX = imageCenterX - scaledWidth / 2;
      const imageTopLeftY = imageCenterY - scaledHeight / 2;

      const cropTopLeftX = 0;
      const cropTopLeftY = 0;

      const relativeX = cropTopLeftX - imageTopLeftX;
      const relativeY = cropTopLeftY - imageTopLeftY;

      const sourceTopLeftX = (relativeX / scale);
      const sourceTopLeftY = (relativeY / scale);

      const sourceCropWidth = cropWidth / scale;
      const sourceCropHeight = cropHeight / scale;

      const finalSourceX = Math.max(0, Math.min(sourceTopLeftX, sourceWidth - sourceCropWidth));
      const finalSourceY = Math.max(0, Math.min(sourceTopLeftY, sourceHeight - sourceCropHeight));
      const finalSourceCropWidth = Math.min(sourceCropWidth, sourceWidth - finalSourceX);
      const finalSourceCropHeight = Math.min(sourceCropHeight, sourceHeight - finalSourceY);

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        img,
        finalSourceX,
        finalSourceY,
        finalSourceCropWidth,
        finalSourceCropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
      resolve(croppedBase64);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64Image;
  });
};

