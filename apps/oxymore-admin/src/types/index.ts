export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  profile_picture?: string;
  banner_picture?: string;
  bio?: string;
  country?: string;
  discord_id?: string;
  steam_id?: string;
  riot_id?: string;
  is_verified: boolean;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
  total_matches?: number;
  wins?: number;
  losses?: number;
}

export interface Tournament {
  id: number;
  name: string;
  description?: string;
  banner_image?: string;
  game: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  max_teams: number;
  entry_fee?: number;
  prize_pool?: number;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  status: 'draft' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled';
  is_major: boolean;
  rules?: string;
  stream_url?: string;
  discord_invite?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  teams_count?: number;
  current_round?: number;
}

export interface Team {
  id: number;
  name: string;
  tag: string;
  logo?: string;
  description?: string;
  country?: string;
  is_verified: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  members_count?: number;
  wins?: number;
  losses?: number;
}

export interface League {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  game: string;
  region: string;
  tier: 'amateur' | 'semi_pro' | 'professional';
  max_teams: number;
  season_start: string;
  season_end: string;
  status: 'upcoming' | 'active' | 'completed';
  prize_pool?: number;
  rules?: string;
  created_at: string;
  updated_at: string;
  teams_count?: number;
}

export interface Match {
  id: number;
  tournament_id?: number;
  league_id?: number;
  team1_id: number;
  team2_id: number;
  scheduled_at: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  team1_score?: number;
  team2_score?: number;
  winner_id?: number;
  round?: number;
  bracket_position?: string;
  stream_url?: string;
  created_at: string;
  updated_at: string;
  team1?: Team;
  team2?: Team;
}

export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements?: string;
  created_at: string;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
  user?: User;
  badge?: Badge;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalTournaments: number;
  totalTeams: number;
  totalMatches: number;
  activeTournaments: number;
  upcomingMatches: number;
  recentSignups: number;
  totalPrizePool: number;
}

export interface TournamentStats {
  id: number;
  name: string;
  registrations: number;
  matches_played: number;
  matches_total: number;
  prize_pool: number;
  status: Tournament['status'];
}

export interface UserActivity {
  user_id: number;
  username: string;
  action: string;
  timestamp: string;
  details?: any;
}

