import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Upload, Tag, Hash, Play, Pause, Volume2, VolumeX, Settings, Check } from 'lucide-react';
import { OXMButton, OXMInput, OXMTextArea, OXMDropdown } from '@oxymore/ui';
import apiService from '../../api/apiService';
import './UploadVideo.scss';

export const UploadVideo: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    id_game: ''
  });

  const [games, setGames] = useState<any[]>([]);
  const [gameOptions, setGameOptions] = useState<{label: string, value: string}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await apiService.get('/games');
        setGames(gamesData);
        const options = gamesData.map((game: any) => ({
          label: game.name,
          value: game.id
        }));
        setGameOptions(options);
      } catch (error) {
        console.error('Erreur lors du chargement des jeux:', error);
      }
    };

    loadGames();
  }, []);

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleVideoSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVideoSelect(file);
    }
  };

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      alert('Veuillez sélectionner une vidéo');
      return;
    }

    if (!formData.title.trim()) {
      alert('Veuillez ajouter un titre');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implémenter l'upload réel
      // const formDataToSend = new FormData();
      // formDataToSend.append('video', videoFile);
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('description', formData.description);
      // formDataToSend.append('tags', formData.tags);
      // formDataToSend.append('id_game', formData.id_game);
      // const response = await apiService.post('/videos/upload', formDataToSend);
      
      // Simulation pour l'instant
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/highlights');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'upload de la vidéo:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-video-page">
      <div className="upload-video-header">
        <button onClick={() => navigate('/highlights')} className="back-btn">
          <ArrowLeft size={20} />
          Retour
        </button>
        <h1 className="page-title">Publier une vidéo</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="upload-video-content">
        {!videoPreview ? (
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={64} className="upload-icon" />
            <p className="upload-text">
              Glissez-déposez votre vidéo ici
              <br />
              ou <span className="upload-link">cliquez pour sélectionner</span>
            </p>
            <p className="upload-hint">
              Formats supportés: MP4, MOV, AVI • Max 500MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="hidden-input"
            />
          </div>
        ) : (
          <div className="upload-editor">
            <div className="editor-preview">
              <div className="video-preview-wrapper">
                <video
                  ref={videoRef}
                  src={videoPreview}
                  className="video-preview"
                  loop
                  muted={isMuted}
                  onClick={togglePlayPause}
                />
                <div className="video-controls-overlay">
                  <button className="control-btn" onClick={togglePlayPause}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button className="control-btn" onClick={toggleMute}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
                <button className="remove-video-btn" onClick={removeVideo}>
                  <X size={18} />
                </button>
              </div>
              <div className="video-info">
                <p className="video-name">{videoFile?.name}</p>
                <p className="video-size">
                  {(videoFile?.size ? videoFile.size / (1024 * 1024) : 0).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="editor-form">
              <div className="form-section">
                <label className="form-label">
                  Titre *
                </label>
                <OXMInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ajouter un titre..."
                  theme="purple"
                  size="large"
                  maxLength={150}
                />
                <span className="char-count">{formData.title.length}/150</span>
              </div>

              <div className="form-section">
                <label className="form-label">
                  Description
                </label>
                <OXMTextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre vidéo..."
                  rows={4}
                  theme="purple"
                  size="large"
                  maxLength={500}
                />
                <span className="char-count">{formData.description.length}/500</span>
              </div>

              <div className="form-section">
                <label className="form-label">
                  <Tag size={16} />
                  Tags
                </label>
                <OXMInput
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="play, clutch, esport, montage"
                  theme="purple"
                  size="large"
                />
                <p className="form-hint">Séparez les tags par des virgules</p>
              </div>

              <div className="form-section">
                <label className="form-label">Jeu (optionnel)</label>
                <OXMDropdown
                  options={gameOptions}
                  value={formData.id_game}
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      id_game: value
                    }));
                  }}
                  placeholder="Sélectionner un jeu"
                  theme="purple"
                />
              </div>

              <div className="form-actions">
                <OXMButton
                  variant="secondary"
                  onClick={removeVideo}
                >
                  <X size={18} />
                  Supprimer
                </OXMButton>
                <OXMButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.title.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Publication...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Publier
                    </>
                  )}
                </OXMButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
