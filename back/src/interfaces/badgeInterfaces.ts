export interface Badge {
  id_badge: string;
  badge_name: string;
  badge_description?: string;
  image_url?: string;
  unlock_condition?: string;
}

export interface BadgeInput {
  badge_name: string;
  badge_description?: string;
  image_url?: string;
  unlock_condition?: string;
}

export interface BadgeUpdate {
  badge_name?: string;
  badge_description?: string;
  image_url?: string;
  unlock_condition?: string;
}

export interface BadgeStats {
  total_badges: number;
  unlocked_badges: number;
  rare_badges: number;
  average_unlocks_per_badge: number;
}
