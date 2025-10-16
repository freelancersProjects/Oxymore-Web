import { UserSanction, UserSanctionData } from "../../interfaces/user/userInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllUserSanctions = async (): Promise<UserSanction[]> => {
  const [rows] = await db.query("SELECT * FROM user_sanction");
  return rows as UserSanction[];
};

export const createUserSanction = async (data: { reason?: string; type: "ban" | "mute" | "warning"; created_at?: string; expires_at?: string; id_user: string; id_admin: string }): Promise<UserSanctionData> => {
  const id_user_sanction = crypto.randomUUID();
  await db.query(
    "INSERT INTO user_sanction (id_user_sanction, reason, type, created_at, expires_at, id_user, id_admin) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      id_user_sanction,
      data.reason ?? null,
      data.type,
      data.created_at ?? new Date().toISOString(),
      data.expires_at ?? null,
      data.id_user,
      data.id_admin
    ]
  );
  return {
    id_user_sanction,
    reason: data.reason,
    type: data.type,
    created_at: data.created_at ?? new Date().toISOString(),
    expires_at: data.expires_at,
    id_user: data.id_user,
    id_admin: data.id_admin
  };
};

export const deleteUserSanction = async (id_user_sanction: string): Promise<void> => {
  await db.query("DELETE FROM user_sanction WHERE id_user_sanction = ?", [id_user_sanction]);
};

