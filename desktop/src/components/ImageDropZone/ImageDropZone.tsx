import React, { useState } from 'react';
import { compressImage } from '../../utils/imageCompression';
import './ImageDropZone.scss';

interface ImageDropZoneProps {
  children: React.ReactNode;
  onImageDrop: (imageData: string) => void;
  className?: string;
  disabled?: boolean;
  type?: 'logo' | 'banner';
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  children,
  onImageDrop,
  className = '',
  disabled = false,
  type = 'banner',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      try {
        const maxWidth = type === 'logo' ? 800 : 1600;
        const compressed = await compressImage(result, maxWidth, 0.85);
        onImageDrop(compressed);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('Files') || types.some(type => type.includes('image'))) {
      setIsDragOver(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0]) {
      await processImageFile(files[0]);
    }
  };

  return (
    <div
      className={`${className} ${isDragOver ? 'drag-over' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default ImageDropZone;

