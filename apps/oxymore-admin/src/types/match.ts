// Interfaces pour les matchs et équipes

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

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
  user?: any;
  badge?: any;
}
