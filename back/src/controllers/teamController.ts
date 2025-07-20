import { Request, Response } from "express";
import * as TeamService from "../services/teamService";

export const getAllTeams = async (req: Request, res: Response) => {
  const teams = await TeamService.getAllTeams();
  res.json(teams);
};

export const createTeam = async (req: Request, res: Response) => {
  const { team_name, team_logo_url, team_banner_url, description, max_members, id_captain } = req.body;
  if (!team_name || !id_captain) {
    res.status(400).json({ message: "team_name et id_captain sont requis" });
    return;
  }
  const newTeam = await TeamService.createTeam({
    team_name,
    team_logo_url,
    team_banner_url,
    description,
    max_members,
    id_captain
  });
  res.status(201).json(newTeam);
};

export const deleteTeam = async (req: Request, res: Response) => {
  await TeamService.deleteTeam(req.params.id);
  res.status(204).send();
};
