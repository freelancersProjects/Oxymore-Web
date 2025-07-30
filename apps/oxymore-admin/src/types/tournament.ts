export interface Tournament {
  id_tournament: string;
  name: string;
  game: string;
  type: string;
  participants_count: number;
  prize_pool: number;
  start_date: string;
  end_date: string;
  description?: string;
  rules?: string;
  format?: string;
  status?: 'upcoming' | 'active' | 'completed';
} 