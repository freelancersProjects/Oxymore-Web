// Review interface
// id_tournament = NULL : avis global sur la plateforme
// id_tournament = rempli : avis spécifique sur un tournoi (fonctionnalité future)
export interface Review {
  id_review: string;
  id_user: string;
  id_team?: string;
  id_tournament?: string; // NULL = avis global, rempli = avis spécifique tournoi
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewInput {
  id_user: string;
  id_team?: string;
  id_tournament?: string; // NULL = avis global, rempli = avis spécifique tournoi
  rating: number;
  comment?: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  reviews_by_rating: Record<number, number>;
}

