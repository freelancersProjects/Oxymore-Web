import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreVertical } from 'lucide-react';
import type { Video } from '../../../types/video';
import './VideoCard.scss';

interface VideoCardProps {
  video: Video;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onSave?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onLike,
  onComment,
  onSave,
  onShare,
  isLiked = false,
  isSaved = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likesCount, setLikesCount] = useState(video.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(video.comments_count || 0);
  const [savesCount, setSavesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(video.shares_count || 0);
  const [newComment, setNewComment] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Activer le son quand l'utilisateur clique pour jouer
        videoRef.current.muted = false;
        videoRef.current.play();
      }
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    if (onLike) {
      onLike(video.id_video);
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
    if (onComment) {
      onComment(video.id_video);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setCommentsCount((prev) => prev + 1);
      setNewComment('');
      // TODO: Envoyer le commentaire à l'API
      if (onComment) {
        onComment(video.id_video);
      }
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    setSavesCount((prev) => (saved ? prev - 1 : prev + 1));
    if (onSave) {
      onSave(video.id_video);
    }
  };

  const handleShare = () => {
    setSharesCount((prev) => prev + 1);
    if (onShare) {
      onShare(video.id_video);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);

      // Attendre que la vidéo soit prête avant de la lancer
      const handleLoadedMetadata = () => {
        videoElement.muted = true;
        videoElement.currentTime = 0;
        videoElement.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error autoplaying video:', error);
          setIsPlaying(false);
        });
      };

      if (videoElement.readyState >= 2) {
        // La vidéo est déjà chargée
        handleLoadedMetadata();
      } else {
        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
      }

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [video.video_url]);

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', 
      '#ef4444', '#06b6d4', '#a855f7', '#f97316', '#84cc16'
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className="video-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="video-card__left">
        <div 
          className="video-card__video-wrapper"
          onClick={handlePlayPause}
        >
          <video
            ref={videoRef}
            src={video.video_url}
            loop
            muted
            playsInline
            autoPlay
          />

          <div className="video-card__actions" onClick={(e) => e.stopPropagation()}>
            <button
              className={`video-card__action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <Heart size={32} fill={liked ? 'currentColor' : 'none'} />
              <span>{formatCount(likesCount)}</span>
            </button>

            <button
              className="video-card__action-btn"
              onClick={handleComment}
            >
              <MessageCircle size={32} />
              <span>{formatCount(commentsCount)}</span>
            </button>

            <button
              className={`video-card__action-btn ${saved ? 'saved' : ''}`}
              onClick={handleSave}
            >
              <Bookmark size={32} fill={saved ? 'currentColor' : 'none'} />
              <span>{formatCount(savesCount)}</span>
            </button>

            <button
              className="video-card__action-btn"
              onClick={handleShare}
            >
              <Share2 size={32} />
              <span>{formatCount(sharesCount)}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="video-card__right">
        <div className="video-card__header">
          <div className="video-card__user">
            {video.avatar_url ? (
              <img
                src={video.avatar_url}
                alt={video.username || 'User'}
                className="video-card__avatar"
              />
            ) : (
              <div
                className="video-card__avatar-placeholder"
                style={{ background: getAvatarColor(video.username || 'U') }}
              >
                {video.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="video-card__user-info">
              <span className="video-card__username">{video.username || 'User'}</span>
              {video.game_badge && (
                <span className="video-card__badge">{video.game_badge}</span>
              )}
            </div>
          </div>
          <button className="video-card__more-btn">
            <MoreVertical size={20} />
          </button>
        </div>

        <h3 className="video-card__title">
          {video.description?.split('#')[0]?.trim() || 'Untitled'}
        </h3>

        {video.description && video.description.includes('#') && (
          <div className="video-card__tags">
            {video.description
              .split(' ')
              .filter((word) => word.startsWith('#'))
              .map((tag, index) => (
                <span key={index} className="video-card__tag">
                  {tag}
                </span>
              ))}
          </div>
        )}

        {showComments && (
          <div className="video-card__comments">
            <div className="video-card__comments-header">
              <h4 className="video-card__comments-title">Commentaires ({commentsCount})</h4>
            </div>
            <div className="video-card__comments-list">
              {commentsCount > 0 ? (
                <>
                  <div className="video-card__comment-item">
                    <div className="video-card__comment-avatar">JD</div>
                    <div className="video-card__comment-content">
                      <div className="video-card__comment-author">JohnDoe</div>
                      <div className="video-card__comment-text">Super vidéo ! 🔥🔥🔥</div>
                      <div className="video-card__comment-time">Il y a 2h</div>
                    </div>
                  </div>
                  <div className="video-card__comment-item">
                    <div className="video-card__comment-avatar">AS</div>
                    <div className="video-card__comment-content">
                      <div className="video-card__comment-author">AliceSmith</div>
                      <div className="video-card__comment-text">Incroyable ce play !</div>
                      <div className="video-card__comment-time">Il y a 5h</div>
                    </div>
                  </div>
                  <div className="video-card__comment-item">
                    <div className="video-card__comment-avatar">MB</div>
                    <div className="video-card__comment-content">
                      <div className="video-card__comment-author">MikeBrown</div>
                      <div className="video-card__comment-text">J'adore cette séquence !</div>
                      <div className="video-card__comment-time">Il y a 1j</div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="video-card__comments-empty">Aucun commentaire pour le moment</p>
              )}
            </div>
            <form className="video-card__comment-form" onSubmit={handleSubmitComment}>
              <input
                type="text"
                className="video-card__comment-input"
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="video-card__comment-submit">
                Publier
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
