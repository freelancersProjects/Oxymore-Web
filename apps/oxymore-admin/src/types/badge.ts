export interface Badge {
  id_badge: string;
  badge_name: string;
  badge_description: string | null;
  image_url: string | null;
  unlock_condition: string | null;
}