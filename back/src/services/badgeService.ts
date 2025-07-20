import { Badge } from "../models/badgeModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllBadges = async (): Promise<Badge[]> => {
  const [rows] = await db.query("SELECT * FROM badge");
  return rows as Badge[];
};

export const createBadge = async (data: Omit<Badge, "id_badge">): Promise<Badge> => {
  const id_badge = crypto.randomUUID();
  await db.query(
    "INSERT INTO badge (id_badge, badge_name, badge_description, image_url, unlock_condition) VALUES (?, ?, ?, ?, ?)",
    [
      id_badge,
      data.badge_name,
      data.badge_description ?? null,
      data.image_url ?? null,
      data.unlock_condition ?? null
    ]
  );
  return { id_badge, ...data };
};

export const deleteBadge = async (id_badge: string): Promise<void> => {
  await db.query("DELETE FROM badge WHERE id_badge = ?", [id_badge]);
};
