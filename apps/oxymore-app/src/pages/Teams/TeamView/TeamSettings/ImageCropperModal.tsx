import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { OXMModal, OXMButton, OXMToast } from '@oxymore/ui';
import { compressImage } from '../../../../utils/imageCompression';
import './ImageCropperModal.scss';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageData: string, position: { x: number; y: number; scale: number }) => void;
  currentImage?: string;
  type: 'logo' | 'banner';
  title: string;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentImage,
  type,
  title
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(currentImage || null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentImage) {
      setImageSrc(currentImage);
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  }, [isOpen, currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ message: "Veuillez sélectionner une image", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      try {
        const maxWidth = type === 'logo' ? 800 : 1600;
        const compressed = await compressImage(result, maxWidth, 0.85);
        setImageSrc(compressed);
        setPosition({ x: 0, y: 0 });
        setScale(1);
      } catch (error) {
        setToast({ message: "Erreur lors du traitement de l'image", type: "error" });
        setImageSrc(result);
        setPosition({ x: 0, y: 0 });
        setScale(1);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc || !imageRef.current || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x - containerRect.left - containerRect.width / 2,
      y: e.clientY - position.y - containerRect.top - containerRect.height / 2
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const image = imageRef.current;

      const imageRect = image.getBoundingClientRect();
      const imageWidth = imageRect.width;
      const imageHeight = imageRect.height;

      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      const containerCenterX = containerRect.left + containerWidth / 2;
      const containerCenterY = containerRect.top + containerHeight / 2;

      let newX = (e.clientX - containerCenterX) - dragStart.x;
      let newY = (e.clientY - containerCenterY) - dragStart.y;

      const scaledImageWidth = imageWidth * scale;
      const scaledImageHeight = imageHeight * scale;

      const maxX = Math.max(0, (scaledImageWidth - containerWidth) / 2);
      const maxY = Math.max(0, (scaledImageHeight - containerHeight) / 2);
      const minX = -maxX;
      const minY = -maxY;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });
    document.addEventListener('mouseleave', handleMouseUp, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, dragStart, scale]);

  const handleZoomIn = () => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.2, 3);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.2, 0.5);
      return newScale;
    });
  };

  const handleSave = () => {
    if (!imageSrc) {
      setToast({ message: "Veuillez sélectionner une image", type: "error" });
      return;
    }

    onSave(imageSrc, { ...position, scale });
    onClose();
  };

  const getImageStyle = () => {
    return {
      transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none' as const,
      pointerEvents: 'auto' as const,
    };
  };

  return (
    <OXMModal isOpen={isOpen} onClose={onClose} variant="blue">
      <div className="image-cropper-modal">
        <div className="image-cropper-modal__header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="image-cropper-modal__content">
          <div className="image-cropper-controls">
            <button
              type="button"
              className="control-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Choisir une image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="zoom-controls">
              <button className="control-btn icon" onClick={handleZoomOut} disabled={scale <= 0.5}>
                <ZoomOut size={18} />
              </button>
              <span className="zoom-value">{Math.round(scale * 100)}%</span>
              <button className="control-btn icon" onClick={handleZoomIn} disabled={scale >= 3}>
                <ZoomIn size={18} />
              </button>
            </div>
            <div className="drag-hint">
              <Move size={16} />
              <span>Glissez pour repositionner</span>
            </div>
          </div>

          <div
            ref={containerRef}
            className={`image-container image-container--${type}`}
          >
            {imageSrc ? (
              <img
                ref={imageRef}
                src={imageSrc}
                alt={type === 'logo' ? 'Logo' : 'Bannière'}
                style={getImageStyle()}
                onMouseDown={handleMouseDown}
                onLoad={() => {
                  setPosition({ x: 0, y: 0 });
                }}
                draggable={false}
              />
            ) : (
              <div className="empty-state">
                <p>Aucune image sélectionnée</p>
              </div>
            )}
          </div>
        </div>

        <div className="image-cropper-modal__footer">
          <OXMButton variant="secondary" onClick={onClose}>
            Annuler
          </OXMButton>
          <OXMButton variant="primary" onClick={handleSave} disabled={!imageSrc}>
            Enregistrer
          </OXMButton>
        </div>
      </div>

      {toast && (
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </OXMModal>
  );
};

export default ImageCropperModal;

