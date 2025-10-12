import { FirstPagePromotionVideo, FirstPagePromotionVideoData } from "../../interfaces/content/contentInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllFirstPagePromotionVideos = async (): Promise<FirstPagePromotionVideo[]> => {
  const [rows] = await db.query("SELECT * FROM first_page_promotion_video");
  return rows as FirstPagePromotionVideo[];
};

export const createFirstPagePromotionVideo = async (data: { video_url: string; title: string; by_user: string }): Promise<FirstPagePromotionVideoData> => {
  const first_page_promotion_video = crypto.randomUUID();
  await db.query(
    "INSERT INTO first_page_promotion_video (first_page_promotion_video, video_url, title, by_user) VALUES (?, ?, ?, ?)",
    [
      first_page_promotion_video,
      data.video_url,
      data.title,
      data.by_user
    ]
  );
  return {
    first_page_promotion_video,
    video_url: data.video_url,
    title: data.title,
    by_user: data.by_user
  };
};

export const deleteFirstPagePromotionVideo = async (first_page_promotion_video: string): Promise<void> => {
  await db.query("DELETE FROM first_page_promotion_video WHERE first_page_promotion_video = ?", [first_page_promotion_video]);
};

