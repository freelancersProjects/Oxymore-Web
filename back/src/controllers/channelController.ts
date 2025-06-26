import { Request, Response } from "express";
import * as ChannelService from "../services/channelService";

export const getAllChannels = async (req: Request, res: Response) => {
  try {
    const channels = await ChannelService.getAllChannels();
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChannelById = async (req: Request, res: Response) => {
  try {
    const channel = await ChannelService.getChannelById(req.params.id);
    if (channel) {
      res.json(channel);
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChannelsByUserId = async (req: Request, res: Response) => {
  try {
    const channels = await ChannelService.getChannelsByUserId(req.params.user_id);
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name, user_id } = req.body;
    if (!name || !user_id) {
      res.status(400).json({ message: "Missing name or user_id" });
      return;
    }
    const newChannel = await ChannelService.createChannel({ name, user_id });
    res.status(201).json(newChannel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateChannelName = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Missing name" });
      return;
    }
    await ChannelService.updateChannelName(id, name);
    res.status(200).json({ message: "Channel updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChannel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ChannelService.deleteChannel(id);
    res.status(200).json({ message: "Channel deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
