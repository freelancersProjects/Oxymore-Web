import { RowDataPacket } from 'mysql2';

export interface Badge extends RowDataPacket {
  id_badge: string;
  badge_name: string;
  badge_description?: string;
  image_url?: string;
  unlock_condition?: string;
}

export interface BadgeData {
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