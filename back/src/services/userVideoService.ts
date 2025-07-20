import { UserVideo } from "../models/userVideoModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllUserVideos = async (): Promise<UserVideo[]> => {
  const [rows] = await db.query("SELECT * FROM user_video");
  return rows as UserVideo[];
};

export const createUserVideo = async (data: Omit<UserVideo, "id_video">): Promise<UserVideo> => {
  const id_video = crypto.randomUUID();
  await db.query(
    "INSERT INTO user_video (id_video, video_url, description, posted_at, likes_count, shares_count, comments_count, is_downloadable, id_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id_video,
      data.video_url,
      data.description ?? null,
      data.posted_at ?? new Date().toISOString(),
      data.likes_count ?? 0,
      data.shares_count ?? 0,
      data.comments_count ?? 0,
      data.is_downloadable ?? false,
      data.id_user
    ]
  );
  return { id_video, ...data };
};

export const deleteUserVideo = async (id_video: string): Promise<void> => {
  await db.query("DELETE FROM user_video WHERE id_video = ?", [id_video]);
};
