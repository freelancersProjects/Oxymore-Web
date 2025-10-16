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

