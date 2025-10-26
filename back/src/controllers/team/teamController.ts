import { Request, Response } from "express";
import * as TeamService from "../../services/team/teamService";

export const getAllTeams = async (req: Request, res: Response) => {
  const teams = await TeamService.getAllTeams();
  res.json(teams);
};

export const createTeam = async (req: Request, res: Response) => {
  const { team_name, team_logo_url, team_banner_url, description, max_members, entry_type, id_captain, verified, region, id_game } = req.body;

  console.log('Received team data:', JSON.stringify(req.body, null, 2));

  if (!team_name || !id_captain) {
    res.status(400).json({ message: "team_name et id_captain sont requis" });
    return;
  }

  // Vérifier que id_captain est bien une string
  if (typeof id_captain !== 'string') {
    res.status(400).json({ message: "id_captain doit être une chaîne de caractères" });
    return;
  }

  try {
    const newTeam = await TeamService.createTeam({
      team_name: String(team_name),
      team_logo_url: team_logo_url || null,
      team_banner_url: team_banner_url || null,
      description: description || null,
      max_members: max_members || null,
      entry_type: entry_type || 'open',
      id_captain: String(id_captain),
      verified: verified || false,
      region: region || null,
      id_game: id_game || null
    });
    res.status(201).json(newTeam);
  } catch (error) {
    if (error instanceof Error && error.message.includes("déjà membre")) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error instanceof Error ? error.message : "Erreur lors de la création de l'équipe" });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  await TeamService.deleteTeam(req.params.id);
  res.status(204).send();
};
