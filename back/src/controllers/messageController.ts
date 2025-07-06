import { Request, Response } from "express";
import * as MessageService from "../services/messageService";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await MessageService.getAllMessages();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByChannelId = async (req: Request, res: Response) => {
  try {
    const messages = await MessageService.getMessagesByChannelId(req.params.channel_id);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { channel_id, user_id, content, is_from_ai } = req.body;
    if (!channel_id || !content || typeof is_from_ai !== "boolean") {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    // user_id peut être null ou absent
    const newMessage = await MessageService.createMessage({ channel_id, user_id, content, is_from_ai });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}; 