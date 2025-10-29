import { TeamChat, TeamChatData } from "../../interfaces/team/teamInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllTeamChats = async (): Promise<TeamChat[]> => {
  const [rows] = await db.query("SELECT * FROM team_chat");
  return rows as TeamChat[];
};

export const createTeamChat = async (data: any): Promise<TeamChatData> => {
  const id_team_chat = crypto.randomUUID();

  // Try to insert with is_admin column
  try {
    await db.query(
      "INSERT INTO team_chat (id_team_chat, message, sent_at, id_team, id_user, is_admin) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id_team_chat,
        data.message,
        data.sent_at ?? new Date().toISOString(),
        data.id_team,
        data.id_user || null,
        data.is_admin ? 1 : 0
      ]
    );
  } catch (error: any) {
    // If column doesn't exist, insert without it
    if (error.code === 'ER_BAD_FIELD_ERROR' && error.sqlMessage?.includes('is_admin')) {
      await db.query(
        "INSERT INTO team_chat (id_team_chat, message, sent_at, id_team, id_user) VALUES (?, ?, ?, ?, ?)",
        [
          id_team_chat,
          data.message,
          data.sent_at ?? new Date().toISOString(),
          data.id_team,
          data.id_user || null
        ]
      );
    } else {
      throw error;
    }
  }

  return {
    id_team_chat,
    ...data
  };
};

export const deleteTeamChat = async (id_team_chat: string): Promise<void> => {
  await db.query("DELETE FROM team_chat WHERE id_team_chat = ?", [id_team_chat]);
};

export const getTeamChatsByTeamId = async (id_team: string): Promise<any[]> => {
  try {
    // Try to select with is_admin column
    const [rows] = await db.query(
      `SELECT
        tc.id_team_chat,
        tc.message,
        tc.sent_at,
        tc.id_team,
        tc.id_user,
        COALESCE(tc.is_admin, 0) as is_admin,
        u.username,
        u.avatar_url
      FROM team_chat tc
      LEFT JOIN user u ON tc.id_user = u.id_user
      WHERE tc.id_team = ?
      ORDER BY tc.sent_at ASC`,
      [id_team]
    );
    return rows as any[];
  } catch (error: any) {
    // If column doesn't exist, select without it and default to 0
    if (error.code === 'ER_BAD_FIELD_ERROR' && error.sqlMessage?.includes('is_admin')) {
      const [rows] = await db.query(
        `SELECT
          tc.id_team_chat,
          tc.message,
          tc.sent_at,
          tc.id_team,
          tc.id_user,
          0 as is_admin,
          u.username,
          u.avatar_url
        FROM team_chat tc
        LEFT JOIN user u ON tc.id_user = u.id_user
        WHERE tc.id_team = ?
        ORDER BY tc.sent_at ASC`,
        [id_team]
      );
      return rows as any[];
    }
    throw error;
  }
};

export const deleteTeamChatById = async (id_team_chat: string): Promise<void> => {
  await db.query("DELETE FROM team_chat WHERE id_team_chat = ?", [id_team_chat]);
};

export const updateTeamChatById = async (id_team_chat: string, message: string): Promise<void> => {
  await db.query("UPDATE team_chat SET message = ? WHERE id_team_chat = ?", [message, id_team_chat]);
};

