import { VideoComment } from "../models/videoCommentModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllVideoComments = async (): Promise<VideoComment[]> => {
  const [rows] = await db.query("SELECT * FROM video_comment");
  return rows as VideoComment[];
};

export const createVideoComment = async (data: Omit<VideoComment, "id_video_comment">): Promise<VideoComment> => {
  const id_video_comment = crypto.randomUUID();
  await db.query(
    "INSERT INTO video_comment (id_video_comment, comment_text, posted_at, id_user, id_video) VALUES (?, ?, ?, ?, ?)",
    [
      id_video_comment,
      data.comment_text,
      data.posted_at ?? new Date().toISOString(),
      data.id_user,
      data.id_video
    ]
  );
  return { id_video_comment, ...data };
};

export const deleteVideoComment = async (id_video_comment: string): Promise<void> => {
  await db.query("DELETE FROM video_comment WHERE id_video_comment = ?", [id_video_comment]);
};
