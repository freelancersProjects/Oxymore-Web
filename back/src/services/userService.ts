import { User, users } from "../models/userModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.query("SELECT * FROM user");
  return rows as User[];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const [rows] = await db.query("SELECT * FROM user WHERE id_user = ?", [id]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
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
    `INSERT INTO user (
      id_user, first_name, last_name, username, email, password_hash, is_premium, avatar_url, banner_url, bio, elo, wallet, country_code, discord_link, faceit_id, steam_link, twitch_link, youtube_link, verified, created_at, team_chat_is_muted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      data.wallet ?? null,
      data.country_code,
      data.discord_link,
      data.faceit_id,
      data.steam_link,
      data.twitch_link,
      data.youtube_link,
      data.verified ?? false,
      created_at,
      data.team_chat_is_muted ?? false,
    ]
  );
  return { id_user, ...data, created_at };
};
