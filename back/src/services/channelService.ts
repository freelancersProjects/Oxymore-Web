import { Channel, channels } from "../models/channelModel";
import crypto from "crypto";
import { db } from "../config/db";

export const getAllChannels = async (): Promise<Channel[]> => {
  const [rows] = await db.query("SELECT * FROM channel");
  return rows as Channel[];
};

export const getChannelById = async (id: string): Promise<Channel | undefined> => {
  const [rows] = await db.query("SELECT * FROM channel WHERE id_channel = ?", [id]);
  return (rows as Channel[])[0];
};

export const getChannelsByUserId = async (user_id: string): Promise<Channel[]> => {
  const [rows] = await db.query("SELECT * FROM channel WHERE user_id = ?", [user_id]);
  return rows as Channel[];
};

export const createChannel = async (data: Omit<Channel, "id_channel" | "created_at">): Promise<Channel> => {
  const id_channel = crypto.randomUUID();
  const created_at = new Date().toISOString();
  await db.query(
    "INSERT INTO channel (id_channel, name, user_id, created_at) VALUES (?, ?, ?, ?)",
    [id_channel, data.name, data.user_id, created_at]
  );
  return { id_channel, ...data, created_at };
};

export const updateChannelName = async (id_channel: string, name: string): Promise<void> => {
  await db.query(
    "UPDATE channel SET name = ? WHERE id_channel = ?",
    [name, id_channel]
  );
};

export const deleteChannel = async (id_channel: string): Promise<void> => {
  await db.query("DELETE FROM channel WHERE id_channel = ?", [id_channel]);
};
