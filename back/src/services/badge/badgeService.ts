import { Badge, BadgeData } from "../../interfaces/badge/badgeInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllBadges = async (): Promise<Badge[]> => {
  const [rows] = await db.query("SELECT * FROM badge");
  return rows as Badge[];
};

export const getBadgeById = async (id_badge: string): Promise<Badge | null> => {
  const [rows] = await db.query("SELECT * FROM badge WHERE id_badge = ?", [id_badge]);
  const badges = rows as Badge[];
  return badges.length > 0 ? badges[0] : null;
};

export const createBadge = async (data: { badge_name: string; badge_description?: string; image_url?: string; unlock_condition?: string }): Promise<BadgeData> => {
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
  return {
    id_badge,
    badge_name: data.badge_name,
    badge_description: data.badge_description,
    image_url: data.image_url,
    unlock_condition: data.unlock_condition
  };
};

export const updateBadge = async (id_badge: string, data: Partial<Omit<Badge, "id_badge">>): Promise<void> => {
  const updates = [];
  const values = [];

  if (data.badge_name !== undefined) {
    updates.push("badge_name = ?");
    values.push(data.badge_name);
  }
  if (data.badge_description !== undefined) {
    updates.push("badge_description = ?");
    values.push(data.badge_description);
  }
  if (data.image_url !== undefined) {
    updates.push("image_url = ?");
    values.push(data.image_url);
  }
  if (data.unlock_condition !== undefined) {
    updates.push("unlock_condition = ?");
    values.push(data.unlock_condition);
  }

  if (updates.length > 0) {
    const query = `UPDATE badge SET ${updates.join(", ")} WHERE id_badge = ?`;
    await db.query(query, [...values, id_badge]);
  }
};

export const deleteBadge = async (id_badge: string): Promise<void> => {
  await db.query("DELETE FROM badge WHERE id_badge = ?", [id_badge]);
};

