export interface Tournament {
  id_tournament: string;
  tournament_name: string;
  organized_by?: string;
  description?: string;
  type: string; // 'league' | 'major' | 'minor' | 'open'
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
}
