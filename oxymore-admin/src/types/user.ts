export interface User {
  id_user: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_premium: boolean;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  elo: number;
  wallet: number | null;
  country_code: string | null;
  discord_link: string | null;
  faceit_id: string | null;
  steam_link: string | null;
  twitch_link: string | null;
  youtube_link: string | null;
  verified: boolean;
  created_at: string;
  team_chat_is_muted: boolean;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
} 