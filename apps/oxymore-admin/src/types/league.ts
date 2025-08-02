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


export interface LeagueExtended extends League {
  teams: Array<{
    id: string;
    name: string;
    points: number;
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
  }>;
  upcoming_matches: Array<{
    id: string;
    team1: string;
    team2: string;
    date: string;
    type: string;
  }>;
  recent_matches: Array<{
    id: string;
    team1: string;
    team1_score: number;
    team2: string;
    team2_score: number;
    date: string;
    type: string;
  }>;
  badge_champion: {
    id: string;
    name: string;
    image_url: string | null;
  };
}
