export interface User {
  id_user: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
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
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}
