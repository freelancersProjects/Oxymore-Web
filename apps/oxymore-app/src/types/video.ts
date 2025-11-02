export interface Video {
  id_video: string;
  video_url: string;
  description?: string;
  posted_at?: string;
  likes_count?: number;
  shares_count?: number;
  comments_count?: number;
  is_downloadable?: boolean;
  id_user: string;
  username?: string;
  avatar_url?: string;
  game_badge?: string;
}

export interface UserSuggestion {
  id_user: string;
  username: string;
  avatar_url?: string;
  follows_you?: boolean;
}

