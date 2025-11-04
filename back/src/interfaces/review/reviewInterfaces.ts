import { RowDataPacket } from 'mysql2';

export interface Review extends RowDataPacket {
  id_review: string;
  id_user: string;
  id_team?: string;
  id_tournament?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewData {
  id_review: string;
  id_user: string;
  id_team?: string;
  id_tournament?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewInput {
  id_user: string;
  id_team?: string;
  id_tournament?: string | null;
  rating: number;
  comment?: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  reviews_by_rating: Record<number, number>;
}

