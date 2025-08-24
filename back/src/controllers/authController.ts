import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserService from "../services/userService";
import { db } from "../config/db";
import { RowDataPacket } from "mysql2";

interface Role extends RowDataPacket {
  id: string;
  name: string;
  description?: string;
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let userRole = null;

    if (typeof user.role_id === 'number') {
      const roleMap: { [key: number]: string } = {
        1: 'user',
        2: 'admin'
      };
      userRole = { name: roleMap[user.role_id] || 'user' };
    } else {
      try {
        const [roles] = await db.execute<Role[]>(
          'SELECT r.* FROM roles r WHERE r.id = ?',
          [user.role_id]
        );
        userRole = roles.length > 0 ? roles[0] : null;
      } catch (error) {
        console.error("Error fetching role:", error);
        userRole = { name: 'user' };
      }
    }

    const { password_hash: _, ...userProfile } = user;

    res.json({
      user: {
        ...userProfile,
        role: userRole?.name || 'user'
      }
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, first_name, last_name } = req.body;

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await UserService.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Récupérer l'UUID du rôle "user" par défaut
    const [roles] = await db.execute<Role[]>(
      'SELECT id FROM roles WHERE name = ?',
      ['user']
    );

    const defaultRoleId = roles.length > 0 ? roles[0].id : 'b0c2d1c3-4b5a-6d7e-8f9g-0h1i2j3k4l5m';

    const newUser = await UserService.createUser({
      email,
      password_hash,
      username,
      first_name,
      last_name,
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
      role_id: defaultRoleId
    });

    const token = jwt.sign(
      { id: newUser.id_user },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id_user,
        email: newUser.email,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Gérer les anciens role_id numériques et les nouveaux UUIDs
    let userRole = null;

    // Si role_id est un nombre (ancien format), mapper vers les rôles
    if (typeof user.role_id === 'number') {
      const roleMap: { [key: number]: string } = {
        1: 'user',
        2: 'admin'
      };
      userRole = { name: roleMap[user.role_id] || 'user' };
    } else {
      // Si c'est un UUID (nouveau format), récupérer depuis la base
      try {
        const [roles] = await db.execute<Role[]>(
          'SELECT r.* FROM roles r WHERE r.id = ?',
          [user.role_id]
        );
        userRole = roles.length > 0 ? roles[0] : null;
      } catch (error) {
        console.error("Error fetching role:", error);
        userRole = { name: 'user' };
      }
    }

    const token = jwt.sign(
      { id: user.id_user },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id_user,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: userRole?.name || 'user',
        elo: user.elo,
        is_premium: user.is_premium,
        avatar_url: user.avatar_url,
        banner_url: user.banner_url,
        bio: user.bio,
        wallet: user.wallet,
        country_code: user.country_code,
        discord_link: user.discord_link,
        faceit_id: user.faceit_id,
        steam_link: user.steam_link,
        twitch_link: user.twitch_link,
        youtube_link: user.youtube_link,
        verified: user.verified,
        team_chat_is_muted: user.team_chat_is_muted,
        created_at: user.created_at
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
