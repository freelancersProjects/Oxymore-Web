export interface Friend {
  id_friend: string;
  id_user_sender: string;
  id_user_receiver: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface FriendInput {
  id_user_sender: string;
  id_user_receiver: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_favorite?: boolean;
}

export interface FriendWithUser {
  id_friend: string;
  id_user_sender: string;
  id_user_receiver: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  // User info
  user_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  elo: number;
  is_premium: boolean;
  verified: boolean;
  // Status info
  online_status?: 'online' | 'offline' | 'in-game';
  last_seen?: string;
}

export interface UserSearchResult {
  id_user: string;
  username: string;
  avatar_url?: string;
  elo: number;
  is_premium: boolean;
  verified: boolean;
  online_status?: 'online' | 'offline' | 'in-game';
  last_seen?: string;
  friend_status?: 'pending' | 'accepted' | 'rejected' | 'blocked';
  id_friend?: string;
}
