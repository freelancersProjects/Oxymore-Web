import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Download,
  Image as ImageIcon,
  FileImage,
  Trash2,
  Loader2,
  Zap,
  FileDown
} from 'lucide-react';
import './WebPConverter.css';

interface ConvertedImage {
  id: string;
  originalFile: File;
  webpBlob: Blob;
  originalSize: number;
  webpSize: number;
  compressionRatio: number;
  preview: string;
}

const WebPConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [quality, setQuality] = useState(80);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour convertir une image en WebP
  const convertToWebP = useCallback((file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Conversion failed'));
            }
          },
          'image/webp',
          quality / 100
        );
      };

      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Gestion du drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/') && !file.type.includes('webp')
    );

    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  // Gestion de la sélection de fichiers
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/') && !file.type.includes('webp')
    );
    setFiles(prev => [...prev, ...selectedFiles]);
  }, []);

  // Conversion des images
  const convertImages = useCallback(async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    const newConvertedImages: ConvertedImage[] = [];

    try {
      for (const file of files) {
        const webpBlob = await convertToWebP(file, quality);
        const preview = URL.createObjectURL(webpBlob);

        const compressionRatio = ((file.size - webpBlob.size) / file.size) * 100;

        newConvertedImages.push({
          id: Math.random().toString(36).substr(2, 9),
          originalFile: file,
          webpBlob,
          originalSize: file.size,
          webpSize: webpBlob.size,
          compressionRatio,
          preview
        });
      }

      setConvertedImages(prev => [...prev, ...newConvertedImages]);
      setFiles([]);
    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
    } finally {
      setIsConverting(false);
    }
  }, [files, quality, convertToWebP]);

  // Téléchargement d'une image convertie
  const downloadImage = useCallback((convertedImage: ConvertedImage) => {
    const url = URL.createObjectURL(convertedImage.webpBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${convertedImage.originalFile.name.split('.')[0]}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Téléchargement de toutes les images
  const downloadAll = useCallback(() => {
    convertedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image);
      }, index * 100);
    });
  }, [convertedImages, downloadImage]);

  // Suppression d'une image convertie
  const removeConvertedImage = useCallback((id: string) => {
    setConvertedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  // Suppression d'un fichier sélectionné
  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Nettoyage des URLs
  React.useEffect(() => {
    return () => {
      convertedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [convertedImages]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl">
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">WebP Converter</h1>
              <p className="text-[var(--text-secondary)]">Convertissez vos images en format WebP pour une meilleure performance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Sélectionner des images
              </h2>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[var(--border-color)] hover:border-blue-500/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[var(--text-primary)]">
                      Glissez-déposez vos images ici
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      ou cliquez pour sélectionner des fichiers
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    Formats supportés: JPG, PNG, GIF, BMP, TIFF
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Qualité WebP: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--overlay-hover)] rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                  <span>Plus petit</span>
                  <span>Plus grand</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={convertImages}
                disabled={files.length === 0 || isConverting}
                className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 converter-button ${
                  files.length === 0 || isConverting
                    ? 'bg-[var(--overlay-hover)] text-[var(--text-muted)] cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Conversion en cours...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Convertir {files.length} image{files.length > 1 ? 's' : ''}
                  </>
                )}
              </motion.button>
            </div>

            {files.length > 0 && (
              <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Fichiers sélectionnés ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-[var(--overlay-hover)] rounded-lg file-item"
                    >
                      <div className="flex items-center gap-3">
                        <FileImage className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{file.name}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {convertedImages.length > 0 && (
              <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Images converties ({convertedImages.length})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadAll}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    Télécharger tout
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {convertedImages.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-[var(--overlay-hover)] rounded-xl border border-[var(--border-color)] converted-image-card"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--overlay-hover)] flex-shrink-0 image-preview">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[var(--text-primary)] truncate">
                            {image.originalFile.name.split('.')[0]}.webp
                          </h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[var(--text-secondary)]">Taille originale:</span>
                              <span className="font-medium">{formatFileSize(image.originalSize)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[var(--text-secondary)]">Taille WebP:</span>
                              <span className="font-medium text-green-500">{formatFileSize(image.webpSize)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-[var(--text-secondary)]">Compression:</span>
                              <span className={`compression-badge ${image.compressionRatio < 0 ? 'negative' : ''}`}>
                                {image.compressionRatio > 0 ? '-' : '+'}{Math.abs(image.compressionRatio).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadImage(image)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeConvertedImage(image.id)}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {convertedImages.length === 0 && files.length === 0 && (
              <div className="bg-[var(--card-background)] rounded-2xl p-12 shadow-lg border border-[var(--border-color)] text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Aucune image sélectionnée
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Sélectionnez des images pour commencer la conversion en WebP
                </p>
              </div>
            )}
          </div>
        </div>

        {convertedImages.length > 0 && (
          <div className="mt-8 bg-[var(--card-background)] rounded-2xl p-6 shadow-lg border border-[var(--border-color)] stats-card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Statistiques de compression
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                  {convertedImages.length}
                </div>
                <div className="text-[var(--text-secondary)]">Images converties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-1">
                  {formatFileSize(
                    convertedImages.reduce((acc, img) => acc + img.originalSize - img.webpSize, 0)
                  )}
                </div>
                <div className="text-[var(--text-secondary)]">Espace économisé</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">
                  {(
                    convertedImages.reduce((acc, img) => acc + img.compressionRatio, 0) / convertedImages.length
                  ).toFixed(1)}%
                </div>
                <div className="text-[var(--text-secondary)]">Compression moyenne</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebPConverter;
