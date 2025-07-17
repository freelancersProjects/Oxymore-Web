import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX, MoreHorizontal, Send, ArrowLeft, X } from 'lucide-react';
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
  const [showShare, setShowShare] = useState(false);
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
    <div className="highlights-tiktok-layout">
      {/* Sidebar gauche (placeholder) */}
      <aside className="highlights-sidebar">
        <button className="highlights-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={28} />
        </button>
        {/* Ajoute ici le menu Oxymore si besoin */}
      </aside>
      {/* Feed vidéo centré */}
      <main className="highlights-feed">
        {/* Progress bar stories */}
        <div className="highlights-progress-bar">
          {highlights.map((_, idx) => (
            <div
              key={idx}
              className={`progress-segment${idx === currentIndex ? ' active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
        {/* Carte vidéo TikTok */}
        <div className="highlights-card">
          {currentHighlight && (
            <>
              <div className="highlights-video-wrapper">
                <video
                  ref={videoRef}
                  src={currentHighlight.videoUrl}
                  loop
                  muted={isMuted}
                  playsInline
                  className="highlights-video"
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ objectFit: 'cover' }}
                />
                {/* Overlay bas gauche */}
                <div className="highlights-overlay-bottom">
                  <div className="highlights-author">@{currentHighlight.author}</div>
                  <div className="highlights-desc">{currentHighlight.description}</div>
                  <button className={`highlights-follow-btn${currentHighlight.isFollowing ? ' following' : ''}`} onClick={() => handleFollow(currentHighlight.id)}>
                    {currentHighlight.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
                {/* Actions à droite */}
                <div className="highlights-actions">
                  <button className={`action-btn like${currentHighlight.isLiked ? ' liked' : ''}`} onClick={() => handleLike(currentHighlight.id)}>
                    <Heart size={28} />
                    <span>{currentHighlight.likes}</span>
                  </button>
                  <button className="action-btn comment" onClick={() => setShowComments(true)}>
                    <MessageCircle size={28} />
                    <span>{currentHighlight.comments}</span>
                  </button>
                  <button className="action-btn share" onClick={() => setShowShare(true)}>
                    <Share2 size={28} />
                    <span>{currentHighlight.shares}</span>
                  </button>
                  <button className="action-btn more">
                    <MoreHorizontal size={28} />
                  </button>
                </div>
              </div>
              {/* Sidebar commentaires TikTok */}
              {showComments && (
                <div className="highlights-comments-sidebar">
                  <div className="comments-header">
                    <span>Comments</span>
                    <button className="close-btn" onClick={() => setShowComments(false)}><X size={24} /></button>
                  </div>
                  <div className="comments-list">
                    <div className="comment-item">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="User" className="comment-avatar" />
                      <div className="comment-content">
                        <div className="comment-author">@gaming_fan</div>
                        <div className="comment-text">This is absolutely insane! 🔥</div>
                      </div>
                    </div>
                    <div className="comment-item">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user2" alt="User" className="comment-avatar" />
                      <div className="comment-content">
                        <div className="comment-author">@esports_lover</div>
                        <div className="comment-text">How did you even do that?! 😱</div>
                      </div>
                    </div>
                  </div>
                  <form className="comments-input-row">
                    <input type="text" placeholder="Add a comment..." />
                    <button type="submit" className="send-btn"><Send size={20} /></button>
                  </form>
                </div>
              )}
              {/* Overlay partage TikTok */}
              {showShare && (
                <div className="highlights-share-overlay">
                  <div className="share-title">Share</div>
                  <div className="share-link-row">
                    <input className="share-link-input" value={window.location.href} readOnly />
                    <button className="copy-btn">Copy</button>
                  </div>
                  <div className="share-socials">
                    <button className="share-social">Twitter</button>
                    <button className="share-social">Discord</button>
                  </div>
                  <button className="close-share" onClick={() => setShowShare(false)}>Close</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Highlights;
