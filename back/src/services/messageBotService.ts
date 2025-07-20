import { MessageBot, messageBots } from "../models/messageBotModel";
import crypto from "crypto";
import { db } from "../config/db";

export const getAllMessageBots = async (): Promise<MessageBot[]> => {
  const [rows] = await db.query("SELECT * FROM message_bot");
  return rows as MessageBot[];
};

export const getMessageBotById = async (id: string): Promise<MessageBot | undefined> => {
  const [rows] = await db.query("SELECT * FROM message_bot WHERE id_message = ?", [id]);
  return (rows as MessageBot[])[0];
};

export const getMessageBotsByChannelId = async (channel_id: string): Promise<MessageBot[]> => {
  const [rows] = await db.query("SELECT * FROM message_bot WHERE channel_id = ?", [channel_id]);
  return rows as MessageBot[];
};

export const createMessageBot = async (data: Omit<MessageBot, 'id_message' | 'created_at'>): Promise<MessageBot> => {
  const id_message = crypto.randomUUID();
  const created_at = new Date().toISOString();
  await db.query(
    "INSERT INTO message_bot (id_message, is_from_ai, content, created_at, channel_id, user_id) VALUES (?, ?, ?, ?, ?, ?)",
    [id_message, data.is_from_ai, data.content, created_at, data.channel_id, data.user_id]
  );
  return { id_message, ...data, created_at };
};

export const deleteMessageBot = async (id_message: string): Promise<void> => {
  await db.query("DELETE FROM message_bot WHERE id_message = ?", [id_message]);
};
