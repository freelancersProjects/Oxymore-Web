import { TeamChatReport, TeamChatReportInput } from "../../interfaces/team/teamChatReportInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const createTeamChatReport = async (data: TeamChatReportInput): Promise<TeamChatReport> => {
  const id_team_chat_report = crypto.randomUUID();
  const created_at = new Date().toISOString();

  await db.query(
    "INSERT INTO team_chat_report (id_team_chat_report, id_team_chat, id_user, reason, created_at) VALUES (?, ?, ?, ?, ?)",
    [
      id_team_chat_report,
      data.id_team_chat,
      data.id_user,
      data.reason,
      created_at
    ]
  );

  return {
    id_team_chat_report,
    ...data,
    created_at
  };
};

export const getTeamChatReportsByMessageId = async (id_team_chat: string): Promise<TeamChatReport[]> => {
  const [rows] = await db.query(
    "SELECT * FROM team_chat_report WHERE id_team_chat = ? ORDER BY created_at DESC",
    [id_team_chat]
  );
  return rows as TeamChatReport[];
};

export const getTeamChatReportsByUserId = async (id_user: string): Promise<TeamChatReport[]> => {
  const [rows] = await db.query(
    "SELECT * FROM team_chat_report WHERE id_user = ? ORDER BY created_at DESC",
    [id_user]
  );
  return rows as TeamChatReport[];
};

