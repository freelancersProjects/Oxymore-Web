export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) {
      return null;
    }

    const afterUpload = pathParts.slice(uploadIndex + 2);
    if (afterUpload.length === 0) {
      return null;
    }

    const publicIdParts = afterUpload;
    const lastPart = publicIdParts[publicIdParts.length - 1];
    const withoutExtension = lastPart.split('.')[0];
    publicIdParts[publicIdParts.length - 1] = withoutExtension;
    
    const publicId = publicIdParts.join('/');
    
    return publicId || null;
  } catch (error) {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex === -1) {
        return null;
      }

      const afterUpload = urlParts.slice(uploadIndex + 2);
      if (afterUpload.length === 0) {
        return null;
      }

      const publicIdParts = [...afterUpload];
      const lastPart = publicIdParts[publicIdParts.length - 1];
      const withoutExtension = lastPart.split('.')[0];
      publicIdParts[publicIdParts.length - 1] = withoutExtension;
      
      const publicId = publicIdParts.join('/');
      
      return publicId || null;
    } catch (fallbackError) {
      console.error('Error extracting public_id from URL:', fallbackError);
      return null;
    }
  }
};

