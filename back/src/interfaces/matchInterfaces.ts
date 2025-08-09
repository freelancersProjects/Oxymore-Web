export interface Match {
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

export interface MatchUpdate {
  score_team1?: number;
  score_team2?: number;
  match_date?: string;
  status?: string;
  is_streamed?: boolean;
  id_tournament?: string;
  id_team1?: string;
  id_team2?: string;
  id_winner_team?: string;
}

export interface MatchStats {
  total_matches: number;
  completed_matches: number;
  upcoming_matches: number;
  streamed_matches: number;
  average_score: number;
}
