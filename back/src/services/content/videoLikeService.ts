import { VideoLike, VideoLikeData } from "../../interfaces/content/videoInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllVideoLikes = async (): Promise<VideoLike[]> => {
  const [rows] = await db.query("SELECT * FROM video_like");
  return rows as VideoLike[];
};

export const createVideoLike = async (data: { liked_at?: string; id_user: string; id_video: string }): Promise<VideoLikeData> => {
  const id_video_like = crypto.randomUUID();
  await db.query(
    "INSERT INTO video_like (id_video_like, liked_at, id_user, id_video) VALUES (?, ?, ?, ?)",
    [
      id_video_like,
      data.liked_at ?? new Date().toISOString(),
      data.id_user,
      data.id_video
    ]
  );
  return {
    id_video_like,
    liked_at: data.liked_at ?? new Date().toISOString(),
    id_user: data.id_user,
    id_video: data.id_video
  };
};

export const deleteVideoLike = async (id_video_like: string): Promise<void> => {
  await db.query("DELETE FROM video_like WHERE id_video_like = ?", [id_video_like]);
};

