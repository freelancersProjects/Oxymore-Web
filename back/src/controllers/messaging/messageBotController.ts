import { Request, Response } from "express";
import * as MessageBotService from "../../services/messaging/messageBotService";

export const getAllMessageBots = async (req: Request, res: Response) => {
  try {
    const messageBots = await MessageBotService.getAllMessageBots();
    res.json(messageBots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessageBotById = async (req: Request, res: Response) => {
  try {
    const messageBot = await MessageBotService.getMessageBotById(req.params.id);
    if (messageBot) {
      res.json(messageBot);
    } else {
      res.status(404).json({ message: "MessageBot not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessageBotsByChannel = async (req: Request, res: Response) => {
  const channel_id = req.query.channel_id as string;

  if (!channel_id) {
    res.status(400).json({ message: "Missing channel_id" });
    return;
  }

  try {
    const messageBots = await MessageBotService.getMessageBotsByChannelId(channel_id);
    res.json(messageBots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMessageBot = async (req: Request, res: Response) => {
  try {
    const { is_from_ai, content, channel_id, user_id } = req.body;
    if (typeof is_from_ai !== 'boolean' || !content || !channel_id || !user_id) {
      res.status(400).json({ message: "Missing or invalid fields" });
      return;
    }
    const newMessageBot = await MessageBotService.createMessageBot({ is_from_ai, content, channel_id, user_id });
    res.status(201).json(newMessageBot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessageBot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await MessageBotService.deleteMessageBot(id);
    res.status(200).json({ message: "MessageBot deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
