import { Request, Response } from "express";
import * as VideoCommentService from "../services/videoCommentService";

export const getAllVideoComments = async (req: Request, res: Response) => {
  const comments = await VideoCommentService.getAllVideoComments();
  res.json(comments);
};

export const createVideoComment = async (req: Request, res: Response) => {
  const { comment_text, posted_at, id_user, id_video } = req.body;
  if (!comment_text || !id_user || !id_video) {
    res.status(400).json({ message: "comment_text, id_user et id_video sont requis" });
    return;
  }
  const newComment = await VideoCommentService.createVideoComment({
    comment_text,
    posted_at,
    id_user,
    id_video
  });
  res.status(201).json(newComment);
};

export const deleteVideoComment = async (req: Request, res: Response) => {
  await VideoCommentService.deleteVideoComment(req.params.id);
  res.status(204).send();
};
