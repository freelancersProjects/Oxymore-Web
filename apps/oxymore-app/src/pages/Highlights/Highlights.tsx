import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoSlider from '../../components/Highlights/VideoSlider/VideoSlider';
import VideoCard from '../../components/Highlights/VideoCard/VideoCard';
import HighlightsSidebar from '../../components/Highlights/HighlightsSidebar/HighlightsSidebar';
import { highlightsService } from '../../services/highlightsService';
import type { Video, UserSuggestion } from '../../types/video';
import './Highlights.scss';

const Highlights: React.FC = () => {
  const navigate = useNavigate();
  const [forYouVideos, setForYouVideos] = useState<Video[]>([]);
  const [mainVideos, setMainVideos] = useState<Video[]>([]);
  const [currentMainVideo, setCurrentMainVideo] = useState<Video | null>(null);
  const [similarVideos, setSimilarVideos] = useState<Video[]>([]);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    id_user: string;
    username: string;
    avatar_url?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const videosContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('useroxm');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser({
            id_user: user.id_user,
            username: user.username,
            avatar_url: user.avatar_url,
          });
        }

        const [forYou, main, suggestionsData] = await Promise.all([
          highlightsService.getForYouVideos(),
          highlightsService.getVideos(),
          highlightsService.getSuggestions(),
        ]);

        setForYouVideos(forYou);
        setMainVideos(main);
        setSuggestions(suggestionsData);
        // Initialiser avec la première vidéo principale si elle existe
        if (main.length > 0 && main[0]) {
          setCurrentMainVideo(main[0]);
        }
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (videoId: string) => {
    if (!currentUser) return;
    try {
      await highlightsService.likeVideo(videoId, currentUser.id_user);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleComment = (videoId: string) => {
    console.log('Comment on video:', videoId);
  };

  const handleSave = async (videoId: string) => {
    console.log('Save video:', videoId);
  };

  const handleShare = (videoId: string) => {
    console.log('Share video:', videoId);
  };

  const handleUpload = () => {
    navigate('/upload');
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) return;
    try {
      await highlightsService.followUser(currentUser.id_user, userId);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleVideoSliderClick = (video: Video) => {
    setCurrentMainVideo(video);
    // TODO: Récupérer les vidéos similaires quand l'API sera prête
    setSimilarVideos([]);
  };

  if (loading) {
    return (
      <div className="highlights-loading">
        <div className="highlights-loading__spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="highlights-page">
      <div className="highlights-page__content">
        <div className="highlights-page__main">
          {forYouVideos.length > 0 && (
            <>
              <VideoSlider videos={forYouVideos} onVideoClick={handleVideoSliderClick} />
              <hr className="highlights-page__divider" />
            </>
          )}

          <div
            ref={videosContainerRef}
            className="highlights-page__videos"
          >
            {currentMainVideo ? (
              <>
                <div className="highlights-page__video-wrapper">
                  <VideoCard
                    video={currentMainVideo}
                    onLike={handleLike}
                    onComment={handleComment}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                </div>

                {similarVideos.length > 0 && (
                  <>
                    <hr className="highlights-page__divider" />
                    <div className="highlights-page__similar-section">
                      <h3 className="highlights-page__similar-title">Vidéos similaires</h3>
                      <div className="highlights-page__similar-videos">
                        {similarVideos.map((video) => (
                          <div key={video.id_video} className="highlights-page__video-wrapper">
                            <VideoCard
                              video={video}
                              onLike={handleLike}
                              onComment={handleComment}
                              onSave={handleSave}
                              onShare={handleShare}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : mainVideos.length > 0 ? (
              mainVideos.map((video) => (
                <div key={video.id_video} className="highlights-page__video-wrapper">
                  <VideoCard
                    video={video}
                    onLike={handleLike}
                    onComment={handleComment}
                    onSave={handleSave}
                    onShare={handleShare}
                  />
                </div>
              ))
            ) : (
              <div className="highlights-page__empty">
                <p>No highlights yet. Be the first to upload one!</p>
              </div>
            )}
          </div>
        </div>

        <HighlightsSidebar
          currentUser={currentUser || undefined}
          suggestions={suggestions}
          onUpload={handleUpload}
          onFollow={handleFollow}
        />
      </div>
    </div>
  );
};

export default Highlights;
