import { RowDataPacket } from 'mysql2';

export interface Match extends RowDataPacket {
  id_match: string;
  score_team1: number;
  score_team2: number;
  match_date: string;
  status: string;
  is_streamed?: boolean;
  id_tournament: string;
  id_team1: string;
  id_team2: string;
  id_winner_team?: string;
}

export interface MatchInput {
  score_team1: number;
  score_team2: number;
  match_date: string;
  status: string;
  is_streamed?: boolean;
  id_tournament: string;
  id_team1: string;
  id_team2: string;
  id_winner_team?: string;
}

export interface MatchData {
  id_match: string;
  score_team1: number;
  score_team2: number;
  match_date: string;
  status: string;
  is_streamed?: boolean;
  id_tournament: string;
  id_team1: string;
  id_team2: string;
  id_winner_team?: string;
}
