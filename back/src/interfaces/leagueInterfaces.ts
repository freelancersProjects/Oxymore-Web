export interface League {
  id_league: string;
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

export interface LeagueInput {
  league_name: string;
  max_teams?: number;
  start_date?: string;
  end_date?: string;
  promotion_slots?: number;
  relegation_slots?: number;
  image_url?: string;
  entry_type?: string;
  id_badge_champion?: string;
}

export interface LeagueUpdate {
  league_name?: string;
  max_teams?: number;
  start_date?: string;
  end_date?: string;
  promotion_slots?: number;
  relegation_slots?: number;
  image_url?: string;
  entry_type?: string;
  id_badge_champion?: string;
}

export interface LeagueStats {
  total_leagues: number;
  active_leagues: number;
  completed_leagues: number;
  total_teams: number;
  average_teams_per_league: number;
}
