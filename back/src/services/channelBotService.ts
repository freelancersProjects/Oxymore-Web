import { ChannelBot, channelBots } from "../models/channelBotModel";
import crypto from "crypto";
import { db } from "../config/db";

export const getAllChannelBots = async (): Promise<ChannelBot[]> => {
  const [rows] = await db.query("SELECT * FROM channel_bot");
  return rows as ChannelBot[];
};

export const getChannelBotById = async (id: string): Promise<ChannelBot | undefined> => {
  const [rows] = await db.query("SELECT * FROM channel_bot WHERE id_channel = ?", [id]);
  return (rows as ChannelBot[])[0];
};

export const getChannelBotsByUserId = async (user_id: string): Promise<ChannelBot[]> => {
  const [rows] = await db.query("SELECT * FROM channel_bot WHERE user_id = ?", [user_id]);
  return rows as ChannelBot[];
};

export const createChannelBot = async (data: Omit<ChannelBot, "id_channel" | "created_at">): Promise<ChannelBot> => {
  const id_channel = crypto.randomUUID();
  const created_at = new Date().toISOString();
  await db.query(
    "INSERT INTO channel_bot (id_channel, name, user_id, created_at) VALUES (?, ?, ?, ?)",
    [id_channel, data.name, data.user_id, created_at]
  );
  return { id_channel, ...data, created_at };
};

export const updateChannelBotName = async (id_channel: string, name: string): Promise<void> => {
  await db.query(
    "UPDATE channel_bot SET name = ? WHERE id_channel = ?",
    [name, id_channel]
  );
};

export const deleteChannelBot = async (id_channel: string): Promise<void> => {
  await db.query("DELETE FROM channel_bot WHERE id_channel = ?", [id_channel]);
};
