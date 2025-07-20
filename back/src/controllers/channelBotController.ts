import { Request, Response } from "express";
import * as ChannelBotService from "../services/channelBotService";

export const getAllChannelBots = async (req: Request, res: Response) => {
  try {
    const channelBots = await ChannelBotService.getAllChannelBots();
    res.json(channelBots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChannelBotById = async (req: Request, res: Response) => {
  try {
    const channelBot = await ChannelBotService.getChannelBotById(req.params.id);
    if (channelBot) {
      res.json(channelBot);
    } else {
      res.status(404).json({ message: "ChannelBot not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChannelBotsByUserId = async (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id as string;
    if (!user_id) {
      res.status(400).json({ message: "Missing user_id" });
      return;
    }
    const channelBots = await ChannelBotService.getChannelBotsByUserId(user_id);
    res.json(channelBots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createChannelBot = async (req: Request, res: Response) => {
  try {
    const { name, user_id } = req.body;
    if (!name || !user_id) {
      res.status(400).json({ message: "Missing name or user_id" });
      return;
    }
    const newChannelBot = await ChannelBotService.createChannelBot({ name, user_id });
    res.status(201).json(newChannelBot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateChannelBotName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Missing name" });
      return;
    }
    await ChannelBotService.updateChannelBotName(id, name);
    res.status(200).json({ message: "ChannelBot updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChannelBot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ChannelBotService.deleteChannelBot(id);
    res.status(200).json({ message: "ChannelBot deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
