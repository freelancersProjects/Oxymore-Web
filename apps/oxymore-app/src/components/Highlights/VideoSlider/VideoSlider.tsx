import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import type { Video } from '../../../types/video';
import './VideoSlider.scss';

interface VideoSliderProps {
  videos: Video[];
  onVideoClick?: (video: Video) => void;
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videos, onVideoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 3));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < videos.length - 3 ? prev + 1 : 0));
  };

  const getVisibleVideos = () => {
    return videos.slice(currentIndex, currentIndex + 3);
  };

  return (
    <div className="video-slider">
      <div className="video-slider__header">
        <h2 className="video-slider__title">For You</h2>
        <div className="video-slider__controls">
          <button
            className="video-slider__control-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="video-slider__control-btn"
            onClick={handleNext}
            disabled={currentIndex >= videos.length - 3}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="video-slider__container" ref={sliderRef}>
        <div
          className="video-slider__track"
          style={{
            transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id_video}
              className="video-slider__item"
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
              onClick={() => onVideoClick?.(video)}
            >
              <div className="video-slider__thumbnail">
                <video
                  src={video.video_url}
                  preload="metadata"
                  muted
                  onLoadedMetadata={(e) => {
                    e.currentTarget.currentTime = 0.1;
                  }}
                />
                {video.game_badge && (
                  <span className="video-slider__badge">{video.game_badge}</span>
                )}
                {video.likes_count !== undefined && (
                  <div className="video-slider__likes">
                    <Heart size={14} fill="currentColor" />
                    <span>{video.likes_count > 999 ? `${(video.likes_count / 1000).toFixed(1)}K` : video.likes_count}</span>
                  </div>
                )}
                <div className="video-slider__avatar">
                  {video.avatar_url ? (
                    <img src={video.avatar_url} alt={video.username || 'User'} />
                  ) : (
                    <div
                      className="video-slider__avatar-placeholder"
                      style={{
                        background: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][
                          (video.username?.charCodeAt(0) || 85) % 5
                        ],
                      }}
                    >
                      {video.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>
              <div className="video-slider__info">
                <div className="video-slider__username">{video.username || 'User'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSlider;

