export interface User {
  id_user: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password_hash: string;
  is_premium: boolean;
  avatar_url: string;
  banner_url: string;
  bio: string;
  elo: number;
  wallet?: number | null;
  country_code: string;
  discord_link: string;
  faceit_id: string;
  steam_link: string;
  twitch_link: string;
  youtube_link: string;
  verified: boolean;
  created_at: string;
  team_chat_is_muted: boolean;
  role_id: string | number;
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
