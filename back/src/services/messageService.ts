import { Message, messages } from "../models/messageModel";
import crypto from "crypto";
import { db } from "../config/db";

export const getAllMessages = async (): Promise<Message[]> => {
  const [rows] = await db.query("SELECT * FROM message");
  return rows as Message[];
};

export const getMessagesByChannelId = async (channel_id: string): Promise<Message[]> => {
  const [rows] = await db.query("SELECT * FROM message WHERE channel_id = ?", [channel_id]);
  return rows as Message[];
};

export const createMessage = async (data: Omit<Message, "id_message" | "created_at">): Promise<Message> => {
  const id_message = crypto.randomUUID();
  const created_at = new Date().toISOString();
  await db.query(
    "INSERT INTO message (id_message, channel_id, user_id, content, is_from_ai, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id_message, data.channel_id, data.user_id ?? null, data.content, data.is_from_ai, created_at]
  );
  return { id_message, ...data, created_at };
}; 