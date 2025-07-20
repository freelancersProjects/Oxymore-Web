import { Request, Response } from "express";
import * as UserService from "../services/userService";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password_hash,
      is_premium,
      avatar_url,
      banner_url,
      bio,
      elo,
      wallet,
      country_code,
      discord_link,
      faceit_id,
      steam_link,
      twitch_link,
      youtube_link,
      verified,
      team_chat_is_muted,
    } = req.body;

    const newUser = await UserService.createUser({
      first_name,
      last_name,
      username,
      email,
      password_hash,
      is_premium: is_premium ?? false,
      avatar_url,
      banner_url,
      bio,
      elo: elo ?? 1000,
      wallet: wallet ?? null,
      country_code,
      discord_link,
      faceit_id,
      steam_link,
      twitch_link,
      youtube_link,
      verified: verified ?? false,
      team_chat_is_muted: team_chat_is_muted ?? false,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
