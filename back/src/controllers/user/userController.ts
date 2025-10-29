import { Request, Response } from "express";
import * as UserService from "../../services/user/userService";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await UserService.createUser({
      ...req.body,
      role_id: req.body.role_id || 1,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const togglePremiumStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_premium } = req.body;

    // Créer un objet de mise à jour compatible avec le type attendu
    const updateData = { is_premium: Boolean(is_premium) } as any;

    const updatedUser = await UserService.updateUser(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: updatedUser,
      message: `Statut premium ${
        is_premium ? "activé" : "désactivé"
      } avec succès`,
    });
  } catch (error) {
    console.error("Error toggling premium status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleTeamChatMute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { team_chat_is_muted } = req.body;

    const updatedUser = await UserService.toggleTeamChatMute(
      id,
      Boolean(team_chat_is_muted)
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      success: true,
      data: updatedUser,
      message: `Notifications du chat d'équipe ${
        team_chat_is_muted ? "désactivées" : "activées"
      }`,
    });
  } catch (error) {
    console.error("Error toggling team chat mute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
