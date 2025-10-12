import { UserVideo, UserVideoData } from "../../interfaces/content/videoInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllUserVideos = async (): Promise<UserVideo[]> => {
  const [rows] = await db.query("SELECT * FROM user_video");
  return rows as UserVideo[];
};

export const createUserVideo = async (data: { video_url: string; description?: string; posted_at?: string; likes_count?: number; shares_count?: number; comments_count?: number; is_downloadable?: boolean; id_user: string }): Promise<UserVideoData> => {
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
  return {
    id_video,
    video_url: data.video_url,
    description: data.description,
    posted_at: data.posted_at ?? new Date().toISOString(),
    likes_count: data.likes_count ?? 0,
    shares_count: data.shares_count ?? 0,
    comments_count: data.comments_count ?? 0,
    is_downloadable: data.is_downloadable ?? false,
    id_user: data.id_user
  };
};

export const deleteUserVideo = async (id_video: string): Promise<void> => {
  await db.query("DELETE FROM user_video WHERE id_video = ?", [id_video]);
};

