import { Request, Response } from "express";
import * as TeamChatService from "../../services/team/teamChatService";

export const getAllTeamChats = async (req: Request, res: Response) => {
  const chats = await TeamChatService.getAllTeamChats();
  res.json(chats);
};

export const createTeamChat = async (req: Request, res: Response) => {
  const { message, sent_at, id_team, id_user } = req.body;
  if (!message || !id_team || !id_user) {
    res.status(400).json({ message: "message, id_team et id_user sont requis" });
    return;
  }
  const newChat = await TeamChatService.createTeamChat({
    message,
    sent_at,
    id_team,
    id_user
  });
  res.status(201).json(newChat);
};

export const deleteTeamChat = async (req: Request, res: Response) => {
  await TeamChatService.deleteTeamChat(req.params.id);
  res.status(204).send();
};
