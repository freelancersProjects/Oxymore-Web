import { Request, Response } from "express";
import * as UserVideoService from "../../services/userVideoService";

export const getAllUserVideos = async (req: Request, res: Response) => {
  const videos = await UserVideoService.getAllUserVideos();
  res.json(videos);
};

export const createUserVideo = async (req: Request, res: Response) => {
  const { video_url, description, posted_at, likes_count, shares_count, comments_count, is_downloadable, id_user } = req.body;
  if (!video_url || !id_user) {
    res.status(400).json({ message: "video_url et id_user sont requis" });
    return;
  }
  const newVideo = await UserVideoService.createUserVideo({
    video_url,
    description,
    posted_at,
    likes_count,
    shares_count,
    comments_count,
    is_downloadable,
    id_user
  });
  res.status(201).json(newVideo);
};

export const deleteUserVideo = async (req: Request, res: Response) => {
  await UserVideoService.deleteUserVideo(req.params.id);
  res.status(204).send();
};
