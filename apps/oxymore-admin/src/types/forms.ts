// Interfaces pour les formulaires

export interface LeagueFormData {
  league_name: string;
  max_teams?: number;
  start_date?: string;
  end_date?: string;
  promotion_slots?: number;
  relegation_slots?: number;
  image_url?: string;
  entry_type?: string; // 'tournament' | 'promotion'
  id_badge_champion?: string;
}

export interface TournamentFormData {
  tournament_name: string;
  organized_by?: string;
  description?: string;
  type: string; // 'ligue' | 'major' | 'open'
  format: string; // 'BO1' | 'BO3' | 'BO5'
  structure: string;
  start_date: string;
  end_date: string;
  check_in_date?: string;
  cash_prize?: number;
  entry_fee?: number;
  max_participant?: number;
  min_participant?: number;
  is_premium?: boolean;
  image_url?: string;
  id_league: string;
  id_badge_winner?: string;
  selected_maps: string[];
}

export interface BadgeFormData {
  badge_name: string;
  badge_description: string;
  unlock_condition: string;
  image_url: string;
}
