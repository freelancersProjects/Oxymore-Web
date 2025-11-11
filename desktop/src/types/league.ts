export interface TeamMatch {
  opponent: string;
  result: 'W' | 'L' | 'D';
  score: string;
}

export interface TeamStats {
  id: number;
  rank: number;
  teamName: string;
  teamLogo: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  winstreak: number;
  lastFiveMatches: TeamMatch[];
  gamesPlayed: number;
  winRate: number;
}

export interface LeagueSeason {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

export interface LeagueDivision {
  id: string;
  name: string;
  level: number;
  maxTeams: number;
}

export interface League {
  id_league: string;
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

export interface LeagueTeamWithDetails {
  id: string;
  league_id: string;
  team_id: string;
  rank: number;
  points: number;
  team_name: string;
  team_logo_url?: string;
  team_banner_url?: string;
  matches_played: number;
  matches_won: number;
  matches_drawn: number;
  matches_lost: number;
  goals_for: number;
  goals_against: number;
  status: string;
}