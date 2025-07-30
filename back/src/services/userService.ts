import { RowDataPacket } from 'mysql2';
import { db } from "../config/db";
import crypto from "crypto";

interface User extends RowDataPacket {
  id_user: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password_hash: string;
  is_premium: boolean;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  elo: number;
  wallet: number;
  country_code?: string;
  discord_link?: string;
  faceit_id?: string;
  steam_link?: string;
  twitch_link?: string;
  youtube_link?: string;
  verified: boolean;
  team_chat_is_muted: boolean;
  created_at: string;
  role_id: string | number; // Accepter les deux types pour la compatibilité
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.execute<User[]>("SELECT * FROM user");
  return rows;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const [rows] = await db.execute<User[]>("SELECT * FROM user WHERE id_user = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.execute<User[]>("SELECT * FROM user WHERE email = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const [rows] = await db.execute<User[]>("SELECT * FROM user WHERE username = ?", [username]);
  return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (data: Omit<User, "id_user" | "created_at">): Promise<User> => {
  const id_user = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  await db.execute(
    `INSERT INTO user (
      id_user, first_name, last_name, username, email, password_hash,
      is_premium, avatar_url, banner_url, bio, elo, wallet,
      country_code, discord_link, faceit_id, steam_link,
      twitch_link, youtube_link, verified, team_chat_is_muted,
      created_at, role_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_user,
      data.first_name,
      data.last_name,
      data.username,
      data.email,
      data.password_hash,
      data.is_premium,
      data.avatar_url,
      data.banner_url,
      data.bio,
      data.elo,
      data.wallet,
      data.country_code,
      data.discord_link,
      data.faceit_id,
      data.steam_link,
      data.twitch_link,
      data.youtube_link,
      data.verified,
      data.team_chat_is_muted,
      created_at,
      data.role_id
    ]
  );
  
  return { id_user, ...data, created_at } as User;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(data), id];
  
  await db.execute(`UPDATE user SET ${fields} WHERE id_user = ?`, values);
  return getUserById(id);
};

export const deleteUser = async (id: string): Promise<void> => {
  await db.execute("DELETE FROM user WHERE id_user = ?", [id]);
};
