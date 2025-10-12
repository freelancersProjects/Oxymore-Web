import { Request, Response } from "express";
import * as FirstPagePromotionVideoService from "../../services/firstPagePromotionVideoService";

export const getAllFirstPagePromotionVideos = async (req: Request, res: Response) => {
  const videos = await FirstPagePromotionVideoService.getAllFirstPagePromotionVideos();
  res.json(videos);
};

export const createFirstPagePromotionVideo = async (req: Request, res: Response) => {
  const { video_url, title, by_user } = req.body;
  if (!video_url || !title || !by_user) {
    res.status(400).json({ message: "video_url, title et by_user sont requis" });
    return;
  }
  const newVideo = await FirstPagePromotionVideoService.createFirstPagePromotionVideo({
    video_url,
    title,
    by_user
  });
  res.status(201).json(newVideo);
};

export const deleteFirstPagePromotionVideo = async (req: Request, res: Response) => {
  await FirstPagePromotionVideoService.deleteFirstPagePromotionVideo(req.params.id);
  res.status(204).send();
};
