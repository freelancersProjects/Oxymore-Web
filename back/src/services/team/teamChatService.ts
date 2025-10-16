import { TeamChat, TeamChatData } from "../../interfaces/team/teamInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllTeamChats = async (): Promise<TeamChat[]> => {
  const [rows] = await db.query("SELECT * FROM team_chat");
  return rows as TeamChat[];
};

export const createTeamChat = async (data: any): Promise<TeamChatData> => {
  const id_team_chat = crypto.randomUUID();
  await db.query(
    "INSERT INTO team_chat (id_team_chat, message, sent_at, id_team, id_user) VALUES (?, ?, ?, ?, ?)",
    [
      id_team_chat,
      data.message,
      data.sent_at ?? new Date().toISOString(),
      data.id_team,
      data.id_user
    ]
  );
  return {
    id_team_chat,
    ...data
  };
};

export const deleteTeamChat = async (id_team_chat: string): Promise<void> => {
  await db.query("DELETE FROM team_chat WHERE id_team_chat = ?", [id_team_chat]);
};

