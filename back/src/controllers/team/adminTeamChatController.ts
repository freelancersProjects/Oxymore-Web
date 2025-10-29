import { Request, Response } from "express";
import * as TeamChatService from "../../services/team/teamChatService";

export const createAdminTeamChat = async (req: Request, res: Response) => {
  try {
    const { message, id_team } = req.body;
    if (!message || !id_team) {
      res.status(400).json({ message: "message et id_team sont requis" });
      return;
    }

    // Pour les messages admin, id_user est NULL car l'admin n'est pas un membre de l'équipe
    const newChat = await TeamChatService.createTeamChat({
      message,
      id_team,
      id_user: null, // NULL pour les messages admin
      is_admin: true
    });
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating admin team chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

