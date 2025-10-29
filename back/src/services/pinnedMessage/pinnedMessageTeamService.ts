import { PinnedMessageTeam } from "../../models/pinnedMessage/pinnedMessageTeamModel";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllPinnedMessageTeams = async (): Promise<PinnedMessageTeam[]> => {
  const [rows] = await db.query("SELECT * FROM pinned_message_team");
  return rows as PinnedMessageTeam[];
};

export const createPinnedMessageTeam = async (data: Omit<PinnedMessageTeam, "id_pinned_message_team">): Promise<PinnedMessageTeam> => {
  const id_pinned_message_team = crypto.randomUUID();
  await db.query(
    "INSERT INTO pinned_message_team (id_pinned_message_team, pinned_at, id_team_chat, pinned_by) VALUES (?, ?, ?, ?)",
    [
      id_pinned_message_team,
      data.pinned_at ?? new Date().toISOString(),
      data.id_team_chat,
      data.pinned_by
    ]
  );
  return { id_pinned_message_team, ...data };
};

export const deletePinnedMessageTeam = async (id_pinned_message_team: string): Promise<void> => {
  await db.query("DELETE FROM pinned_message_team WHERE id_pinned_message_team = ?", [id_pinned_message_team]);
};

export const getPinnedMessagesByTeamId = async (id_team: string): Promise<any[]> => {
  const [rows] = await db.query(
    `SELECT
      pmt.id_pinned_message_team,
      pmt.pinned_at,
      pmt.id_team_chat,
      pmt.pinned_by,
      tc.message,
      tc.sent_at,
      tc.id_user,
      u.username,
      u.avatar_url
    FROM pinned_message_team pmt
    LEFT JOIN team_chat tc ON pmt.id_team_chat = tc.id_team_chat
    LEFT JOIN user u ON tc.id_user = u.id_user
    WHERE tc.id_team = ?
    ORDER BY pmt.pinned_at DESC`,
    [id_team]
  );
  return rows as any[];
};

export const deletePinnedMessageByChatId = async (id_team_chat: string): Promise<void> => {
  await db.query("DELETE FROM pinned_message_team WHERE id_team_chat = ?", [id_team_chat]);
};

