import { ShopItem } from "../models/shopItemModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllShopItems = async (): Promise<ShopItem[]> => {
  const [rows] = await db.query("SELECT * FROM shop_item");
  return rows as ShopItem[];
};

export const createShopItem = async (data: Omit<ShopItem, "id_item">): Promise<ShopItem> => {
  const id_item = crypto.randomUUID();
  await db.query(
    "INSERT INTO shop_item (id_item, item_name, image_url, price_eur, percentage_premium, external_url) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_item,
      data.item_name,
      data.image_url ?? null,
      data.price_eur,
      data.percentage_premium ?? null,
      data.external_url ?? null
    ]
  );
  return { id_item, ...data };
};

export const deleteShopItem = async (id_item: string): Promise<void> => {
  await db.query("DELETE FROM shop_item WHERE id_item = ?", [id_item]);
};
