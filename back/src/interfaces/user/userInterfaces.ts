import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id_user: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password_hash: string;
  is_premium: boolean;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  elo: number;
  wallet: number;
  country_code?: string;
  discord_link?: string;
  faceit_id?: string;
  steam_link?: string;
  twitch_link?: string;
  youtube_link?: string;
  verified: boolean;
  team_chat_is_muted: boolean;
  created_at: string;
  role_id: string | number; // Accepter les deux types pour la compatibilité
}

export interface UserInput {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password_hash: string;
  is_premium?: boolean;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  elo?: number;
  wallet?: number;
  country_code?: string;
  discord_link?: string;
  faceit_id?: string;
  steam_link?: string;
  twitch_link?: string;
  youtube_link?: string;
  verified?: boolean;
  team_chat_is_muted?: boolean;
  role_id?: string | number;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  is_premium?: boolean;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  elo?: number;
  wallet?: number;
  country_code?: string;
  discord_link?: string;
  faceit_id?: string;
  steam_link?: string;
  twitch_link?: string;
  youtube_link?: string;
  verified?: boolean;
  team_chat_is_muted?: boolean;
  role_id?: string | number;
}

export interface UserStats {
  total_users: number;
  premium_users: number;
  verified_users: number;
  active_users: number;
  new_users_this_month: number;
}

export interface UserBadge extends RowDataPacket {
  id_user_badge: string;
  unlocked_date?: string;
  id_user: string;
  id_badge: string;
}

export interface UserBadgeInput {
  unlocked_date?: string;
  id_user: string;
  id_badge: string;
}

export interface UserBadgeData {
  id_user_badge: string;
  unlocked_date?: string;
  id_user: string;
  id_badge: string;
}

export interface UserFollowing extends RowDataPacket {
  id_user_following: string;
  followed_at?: string;
  id_follower: string;
  id_followed: string;
}

export interface UserFollowingInput {
  followed_at?: string;
  id_follower: string;
  id_followed: string;
}

export interface UserFollowingData {
  id_user_following: string;
  followed_at?: string;
  id_follower: string;
  id_followed: string;
}

export interface UserSanction extends RowDataPacket {
  id_user_sanction: string;
  reason?: string;
  type: "ban" | "mute" | "warning";
  created_at?: string;
  expires_at?: string;
  id_user: string;
  id_admin: string;
}

export interface UserSanctionInput {
  reason?: string;
  type: "ban" | "mute" | "warning";
  created_at?: string;
  expires_at?: string;
  id_user: string;
  id_admin: string;
}

export interface UserSanctionData {
  id_user_sanction: string;
  reason?: string;
  type: "ban" | "mute" | "warning";
  created_at?: string;
  expires_at?: string;
  id_user: string;
  id_admin: string;
}
