import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX, MoreHorizontal, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Highlights.scss';

const OXY_BLUE = '#1593CE';

const mockHighlights = [
  {
    id: 1,
    videoUrl: '/src/assets/videos/test.mp4',
    author: 'Player1',
    description: 'Incroyable clutch en finale !',
    likes: 128,
    isLiked: false,
    isFollowing: false,
    comments: 2,
    shares: 5,
  },
  {
    id: 2,
    videoUrl: '/src/assets/videos/test.mp4',
    author: 'Player2',
    description: 'Ace round, insane !',
    likes: 92,
    isLiked: false,
    isFollowing: false,
    comments: 1,
    shares: 2,
  },
];

const Highlights = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [highlights, setHighlights] = useState(mockHighlights);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('highlights-page');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove('highlights-page');
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  // Swipe/touch/mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = startY - currentY;
    const threshold = 100;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < highlights.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
    setIsDragging(false);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches && e.touches[0]) {
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      setCurrentY(e.touches[0].clientY);
    }
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = startY - currentY;
    const threshold = 100;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < highlights.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
    setIsDragging(false);
  };

  const currentHighlight = highlights[currentIndex] ?? null;

  // Like/follow/share handlers
  const handleLike = (id: number) => {
    setHighlights(prev => prev.map(highlight =>
      highlight.id === id
        ? { ...highlight, isLiked: !highlight.isLiked, likes: highlight.isLiked ? highlight.likes - 1 : highlight.likes + 1 }
        : highlight
    ));
  };
  const handleFollow = (id: number) => {
    setHighlights(prev => prev.map(highlight =>
      highlight.id === id
        ? { ...highlight, isFollowing: !highlight.isFollowing }
        : highlight
    ));
  };

  return (
    <div className="highlights-tt-layout"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Flèche retour */}
      <button className="highlights-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={32} />
      </button>
      {/* Vidéo fullscreen et overlays, seulement si currentHighlight existe */}
      {currentHighlight && (
        <>
          <video
            ref={videoRef}
            src={currentHighlight.videoUrl}
            loop
            muted={isMuted}
            playsInline
            className="highlight-video"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ objectFit: 'cover', width: '100vw', height: '100vh' }}
          />
          {/* Overlays */}
          <div className="highlight-overlay">
            {/* Actions à droite */}
            <div className="highlight-actions">
              <button className={`like-btn${currentHighlight.isLiked ? ' liked' : ''}`} onClick={() => handleLike(currentHighlight.id)}>
                <Heart size={28} />
                <span>{currentHighlight.likes}</span>
              </button>
              <button className="comment-btn" onClick={() => setShowComments(!showComments)}>
                <MessageCircle size={28} />
                <span>{currentHighlight.comments}</span>
              </button>
              <button className="share-btn">
                <Share2 size={28} />
                <span>{currentHighlight.shares}</span>
              </button>
              <button className="more-btn">
                <MoreHorizontal size={28} />
              </button>
            </div>
            {/* Infos auteur et description */}
            <div className="highlight-desc">
              <div className="highlight-user" style={{ color: OXY_BLUE }}>@{currentHighlight.author}</div>
              <div className="highlight-text">{currentHighlight.description}</div>
              <button className={`follow-btn${currentHighlight.isFollowing ? ' following' : ''}`} onClick={() => handleFollow(currentHighlight.id)}>
                {currentHighlight.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            {/* Barre de progression */}
            <div className="progress-indicator">
              {highlights.map((_, idx) => (
                <div
                  key={idx}
                  className={`progress-dot${idx === currentIndex ? ' active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
            {/* Sidebar commentaires */}
            {showComments && (
              <div className="highlight-comments">
                <div className="highlight-comments-title">Commentaires</div>
                <div className="highlight-comments-list">
                  <div className="highlight-comment">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="User" className="comment-avatar" />
                    <b style={{ color: OXY_BLUE }}>@gaming_fan</b> This is absolutely insane! 🔥
                  </div>
                  <div className="highlight-comment">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user2" alt="User" className="comment-avatar" />
                    <b style={{ color: OXY_BLUE }}>@esports_lover</b> How did you even do that?! 😱
                  </div>
                </div>
                <form className="highlight-comment-form">
                  <input type="text" placeholder="Ajouter un commentaire..." />
                  <button type="submit" className="send-btn"><Send size={20} /></button>
                </form>
                <button className="hide-comments-btn" onClick={() => setShowComments(false)} type="button">Masquer</button>
              </div>
            )}
            {!showComments && (
              <button className="show-comments-btn" onClick={() => setShowComments(true)} type="button">
                <MessageCircle size={22} /> Afficher les commentaires
              </button>
            )}
            {/* Contrôles vidéo */}
            <div className="video-controls">
              <button className="control-btn play-pause" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button className="control-btn mute" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Highlights;
