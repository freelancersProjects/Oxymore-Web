import { RowDataPacket } from 'mysql2';

export interface TournamentPageConfig extends RowDataPacket {
  id_config: string;
  show_category_cards: boolean;
  featured_tournament_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TournamentPageConfigData {
  show_category_cards: boolean;
  featured_tournament?: any;
}

