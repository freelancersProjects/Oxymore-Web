import { UserBadge, UserBadgeData } from "../../interfaces/user/userInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllUserBadges = async (): Promise<UserBadge[]> => {
  const [rows] = await db.query("SELECT * FROM user_badge");
  return rows as UserBadge[];
};

export const createUserBadge = async (data: { unlocked_date?: string; id_user: string; id_badge: string }): Promise<UserBadgeData> => {
  const id_user_badge = crypto.randomUUID();
  await db.query(
    "INSERT INTO user_badge (id_user_badge, unlocked_date, id_user, id_badge) VALUES (?, ?, ?, ?)",
    [
      id_user_badge,
      data.unlocked_date ?? new Date().toISOString(),
      data.id_user,
      data.id_badge
    ]
  );
  return {
    id_user_badge,
    unlocked_date: data.unlocked_date ?? new Date().toISOString(),
    id_user: data.id_user,
    id_badge: data.id_badge
  };
};

export const deleteUserBadge = async (id_user_badge: string): Promise<void> => {
  await db.query("DELETE FROM user_badge WHERE id_user_badge = ?", [id_user_badge]);
};

