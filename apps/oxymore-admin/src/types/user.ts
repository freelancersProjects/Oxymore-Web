export interface User {
  id_user: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  is_premium: boolean;
  verified: boolean;
  elo?: number;
  wallet?: number;
  country_code?: string;
  created_at?: string;
  tournaments_count?: number;
  teams_count?: number;
  twitter_url?: string;
  twitch_url?: string;
  youtube_url?: string;
  steam_url?: string;
  faceit_url?: string;
  team_chat_is_muted?: boolean;
  role?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
} 