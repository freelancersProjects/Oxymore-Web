import { User, users } from "../models/userModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.query("SELECT * FROM user");
  return rows as User[];
};

export const getUserById = (id: string): User | undefined => {
  return users.find((u) => u.id_user === id);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

export const createUser = async (
  data: Omit<User, "id_user" | "created_at">
): Promise<User> => {
  const id_user = crypto.randomUUID();
  const created_at = new Date().toISOString();
  await db.query(
    "INSERT INTO user (id_user, first_name, last_name, username, email, password_hash, is_premium, avatar_url, banner_url, bio, elo, xp_total, wallet, country_code, discord_tag, faceit_id, verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id_user,
      data.first_name,
      data.last_name,
      data.username,
      data.email,
      data.password_hash,
      data.is_premium ?? false,
      data.avatar_url,
      data.banner_url,
      data.bio,
      data.elo ?? 1000,
      data.xp_total ?? 0,
      data.wallet ?? null,
      data.country_code,
      data.discord_tag,
      data.faceit_id,
      data.verified ?? false,
      created_at,
    ]
  );
  return { id_user, ...data, created_at };
};
