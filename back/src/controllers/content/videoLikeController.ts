import { Request, Response } from "express";
import * as VideoLikeService from "../../services/content/videoLikeService";

export const getAllVideoLikes = async (req: Request, res: Response) => {
  const likes = await VideoLikeService.getAllVideoLikes();
  res.json(likes);
};

export const createVideoLike = async (req: Request, res: Response) => {
  const { liked_at, id_user, id_video } = req.body;
  if (!id_user || !id_video) {
    res.status(400).json({ message: "id_user et id_video sont requis" });
    return;
  }
  const newLike = await VideoLikeService.createVideoLike({
    liked_at,
    id_user,
    id_video
  });
  res.status(201).json(newLike);
};

export const deleteVideoLike = async (req: Request, res: Response) => {
  await VideoLikeService.deleteVideoLike(req.params.id);
  res.status(204).send();
};
