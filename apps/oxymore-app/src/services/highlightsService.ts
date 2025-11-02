import apiService from '../api/apiService';
import type { Video, UserSuggestion } from '../types/video';

const defaultVideos: Video[] = [
  {
    id_video: '1',
    video_url: 'https://res.cloudinary.com/dc94ncztl/video/upload/v1751837927/nkq4utl2MVJU99bLJiIZnw_picedm.mp4',
    description: '1v3 with 10 seconds on the clock, no backup, no problem, watch how silentops flips the round in cs2 summer showdown. #clutch #headshot #ecoround #sniperace #smokeplay #1v5clutch',
    posted_at: new Date().toISOString(),
    likes_count: 1200,
    shares_count: 10,
    comments_count: 100,
    is_downloadable: true,
    id_user: '1',
    username: 'silentops',
    avatar_url: undefined,
    game_badge: 'CS2',
  },
  {
    id_video: '2',
    video_url: 'https://res.cloudinary.com/dc94ncztl/video/upload/v1751837925/CBT9pT35dI_lAYa0NBexqQ_q71khu.mp4',
    description: 'Ace on Bind – Semi Finals Clutch 1v3 Victory #ace #clutch #cs2',
    posted_at: new Date().toISOString(),
    likes_count: 980,
    shares_count: 25,
    comments_count: 57,
    is_downloadable: true,
    id_user: '2',
    username: 'ShadowSlayer',
    avatar_url: undefined,
    game_badge: 'CS2',
  },
  {
    id_video: '3',
    video_url: 'https://res.cloudinary.com/dc94ncztl/video/upload/v1751837925/27Fk7HvcfJkD9Z1Z5eUU2Q_owiqb5.mp4',
    description: 'Perfect Nade – CS2 Double Knockout in Semi-Final #nade #clutch',
    posted_at: new Date().toISOString(),
    likes_count: 750,
    shares_count: 15,
    comments_count: 40,
    is_downloadable: true,
    id_user: '3',
    username: 'FlashFury',
    avatar_url: undefined,
    game_badge: 'CS2',
  },
  {
    id_video: '4',
    video_url: 'https://res.cloudinary.com/dc94ncztl/video/upload/v1751837924/9u-IFqXx4y1RKS9ej5r3jA_jokcbp.mp4',
    description: 'Insane Flickshot AWP highlight #awp #flickshot',
    posted_at: new Date().toISOString(),
    likes_count: 1100,
    shares_count: 30,
    comments_count: 87,
    is_downloadable: true,
    id_user: '4',
    username: 'SilentShot',
    avatar_url: undefined,
    game_badge: 'CS2',
  },
  {
    id_video: '5',
    video_url: 'https://res.cloudinary.com/dc94ncztl/video/upload/v1751837924/xgKkzfRhiUqLVtBDnjMCKQ_d28nfb.mp4',
    description: 'Tactical Outplay Strategic Team Movement #tactical #teamplay',
    posted_at: new Date().toISOString(),
    likes_count: 650,
    shares_count: 12,
    comments_count: 35,
    is_downloadable: true,
    id_user: '5',
    username: 'TacticalPro',
    avatar_url: undefined,
    game_badge: 'CS2',
  },
  {
    id_video: '6',
    video_url: 'https://res.cloudinary.com/dc94ncztl/video/upload/v1751837927/nkq4utl2MVJU99bLJiIZnw_picedm.mp4',
    description: 'Ninja Defuse in 1v4 situation #defuse #clutch #ninja',
    posted_at: new Date().toISOString(),
    likes_count: 890,
    shares_count: 18,
    comments_count: 52,
    is_downloadable: true,
    id_user: '6',
    username: 'NinjaDefuse',
    avatar_url: undefined,
    game_badge: 'CS2',
  },
];

const defaultSuggestions: UserSuggestion[] = [
  {
    id_user: '2',
    username: 'imkir',
    avatar_url: undefined,
    follows_you: true,
  },
  {
    id_user: '3',
    username: 'ShadowSlayer',
    avatar_url: undefined,
    follows_you: false,
  },
  {
    id_user: '4',
    username: 'FlashFury',
    avatar_url: undefined,
    follows_you: true,
  },
  {
    id_user: '5',
    username: 'SilentShot',
    avatar_url: undefined,
    follows_you: false,
  },
];

export const highlightsService = {
  async getVideos(): Promise<Video[]> {
    try {
      const response = await apiService.get('/api/user-videos');
      if (response && Array.isArray(response) && response.length > 0) {
        return response as Video[];
      }
      return defaultVideos;
    } catch (error) {
      console.error('Error fetching videos, using default:', error);
      return defaultVideos;
    }
  },

  async getForYouVideos(): Promise<Video[]> {
    try {
      const videos = await this.getVideos();
      return videos.slice(0, 6);
    } catch (error) {
      console.error('Error fetching for you videos, using default:', error);
      return defaultVideos.slice(0, 6);
    }
  },

  async getSuggestions(): Promise<UserSuggestion[]> {
    try {
      const response = await apiService.get('/api/user-followings/suggestions');
      if (response && Array.isArray(response) && response.length > 0) {
        return response as UserSuggestion[];
      }
      return defaultSuggestions;
    } catch (error) {
      console.error('Error fetching suggestions, using default:', error);
      return defaultSuggestions;
    }
  },

  async likeVideo(videoId: string, userId: string): Promise<void> {
    try {
      await apiService.post('/api/video-likes', {
        id_video: videoId,
        id_user: userId,
      });
    } catch (error) {
      console.error('Error liking video:', error);
      throw error;
    }
  },

  async followUser(followerId: string, followedId: string): Promise<void> {
    try {
      await apiService.post('/api/user-followings', {
        id_user_follower: followerId,
        id_user_followed: followedId,
      });
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  },
};

