import { RowDataPacket } from 'mysql2';

export interface Friend extends RowDataPacket {
  id_friend: string;
  id_user_sender: string;
  id_user_receiver: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface FriendData {
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

export interface FriendWithUser extends FriendData {
  user_id: string;
  username: string;
  avatar_url?: string;
  elo: number;
  is_premium: boolean;
  verified: boolean;
  online_status?: 'online' | 'offline' | 'in-game';
  last_seen?: string;
}
