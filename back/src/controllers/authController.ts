import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserService from "../services/userService";

const JWT_SECRET = process.env.JWT_SECRET || "votre-super-secret-temporaire";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, first_name, last_name } = req.body;

    if (!email || !password || !username) {
      res.status(400).json({ message: "Email, password and username are required." });
      return;
    }

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await UserService.createUser({
      email,
      password_hash,
      username,
      first_name: first_name || "",
      last_name: last_name || "",
      is_premium: false,
      avatar_url: "",
      banner_url: "",
      bio: "",
      elo: 1000,
      wallet: 0,
      country_code: "",
      discord_link: "",
      faceit_id: "",
      steam_link: "",
      twitch_link: "",
      youtube_link: "",
      verified: false,
      team_chat_is_muted: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...userWithoutPassword } = user;

    const token = jwt.sign({ id: user.id_user }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, user: userWithoutPassword });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
