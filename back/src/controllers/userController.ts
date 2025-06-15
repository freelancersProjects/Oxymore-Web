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

export const getUserById = (req: Request, res: Response) => {
  const user = UserService.getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const createUser = (req: Request, res: Response) => {
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
    xp_total,
    wallet,
    country_code,
    discord_tag,
    faceit_id,
    verified,
  } = req.body;

  const newUser = UserService.createUser({
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
    xp_total: xp_total ?? 0,
    wallet: wallet ?? null,
    country_code,
    discord_tag,
    faceit_id,
    verified: verified ?? false,
  });

  res.status(201).json(newUser);
};
