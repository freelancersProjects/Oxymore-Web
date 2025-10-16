import { RowDataPacket } from 'mysql2';

export interface ShopItem extends RowDataPacket {
  id_item: string;
  item_name: string;
  image_url?: string;
  price_eur: number;
  percentage_premium?: number;
  external_url?: string;
}

export interface ShopItemInput {
  item_name: string;
  image_url?: string;
  price_eur: number;
  percentage_premium?: number;
  external_url?: string;
}

export interface ShopItemData {
  id_item: string;
  item_name: string;
  image_url?: string;
  price_eur: number;
  percentage_premium?: number;
  external_url?: string;
}
