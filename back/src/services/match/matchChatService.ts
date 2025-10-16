import { MatchChat } from "../../models/match/matchChatModel";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllMatchChats = async (): Promise<MatchChat[]> => {
  const [rows] = await db.query("SELECT * FROM match_chat");
  return rows as MatchChat[];
};

export const createMatchChat = async (data: Omit<MatchChat, "id_match_chat">): Promise<MatchChat> => {
  const id_match_chat = crypto.randomUUID();
  await db.query(
    "INSERT INTO match_chat (id_match_chat, message, sent_at, id_match, id_user) VALUES (?, ?, ?, ?, ?)",
    [
      id_match_chat,
      data.message,
      data.sent_at ?? new Date().toISOString(),
      data.id_match,
      data.id_user
    ]
  );
  return { id_match_chat, ...data };
};

export const deleteMatchChat = async (id_match_chat: string): Promise<void> => {
  await db.query("DELETE FROM match_chat WHERE id_match_chat = ?", [id_match_chat]);
};

