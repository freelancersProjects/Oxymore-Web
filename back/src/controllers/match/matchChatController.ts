import { Request, Response } from "express";
import * as MatchChatService from "../../services/match/matchChatService";

export const getAllMatchChats = async (req: Request, res: Response) => {
  const chats = await MatchChatService.getAllMatchChats();
  res.json(chats);
};

export const createMatchChat = async (req: Request, res: Response) => {
  const { message, sent_at, id_match, id_user } = req.body;
  if (!message || !id_match || !id_user) {
    res.status(400).json({ message: "message, id_match et id_user sont requis" });
    return;
  }
  const newChat = await MatchChatService.createMatchChat({
    message,
    sent_at,
    id_match,
    id_user
  });
  res.status(201).json(newChat);
};

export const deleteMatchChat = async (req: Request, res: Response) => {
  await MatchChatService.deleteMatchChat(req.params.id);
  res.status(204).send();
};
