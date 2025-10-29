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

export const updateTeamChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    await TeamChatService.updateTeamChatById(req.params.id, message);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating team chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTeamChatById = async (req: Request, res: Response): Promise<void> => {
  try {
    await TeamChatService.deleteTeamChatById(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeamChatsByTeamId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_team } = req.params;
    const chats = await TeamChatService.getTeamChatsByTeamId(id_team);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching team chats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
