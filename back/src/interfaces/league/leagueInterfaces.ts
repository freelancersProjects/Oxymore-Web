import { RowDataPacket } from 'mysql2';

export interface League extends RowDataPacket {
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

export interface LeagueData {
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

export interface LeagueTeamWithDetails extends RowDataPacket {
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