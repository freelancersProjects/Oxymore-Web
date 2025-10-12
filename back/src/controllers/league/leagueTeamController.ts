import { Request, Response } from "express";
import * as LeagueTeamService from "../../services/league/leagueTeamService";

export const getAllLeagueTeams = async (req: Request, res: Response) => {
  const leagueTeams = await LeagueTeamService.getAllLeagueTeams();
  res.json(leagueTeams);
};

export const getLeagueTeamById = async (req: Request, res: Response) => {
  const leagueTeam = await LeagueTeamService.getLeagueTeamById(req.params.id);
  if (!leagueTeam) {
    res.status(404).json({ message: "League team not found" });
    return;
  }
  res.json(leagueTeam);
};

export const getLeagueTeamsByLeagueId = async (req: Request, res: Response) => {
  const leagueTeams = await LeagueTeamService.getLeagueTeamsByLeagueId(req.params.leagueId);
  res.json(leagueTeams);
};

export const getLeagueTeamsByTeamId = async (req: Request, res: Response) => {
  const leagueTeams = await LeagueTeamService.getLeagueTeamsByTeamId(req.params.teamId);
  res.json(leagueTeams);
};

export const getLeagueTeamByLeagueAndTeam = async (req: Request, res: Response) => {
  const { leagueId, teamId } = req.params;
  const leagueTeam = await LeagueTeamService.getLeagueTeamByLeagueAndTeam(leagueId, teamId);
  if (!leagueTeam) {
    res.status(404).json({ message: "League team not found" });
    return;
  }
  res.json(leagueTeam);
};

export const createLeagueTeam = async (req: Request, res: Response) => {
  const { league_id, team_id, status, matches_played, matches_won, matches_drawn, matches_lost, goals_for, goals_against, points, current_position } = req.body;

  if (!league_id || !team_id) {
    res.status(400).json({ message: "league_id et team_id sont requis" });
    return;
  }

  const newLeagueTeam = await LeagueTeamService.createLeagueTeam({
    league_id,
    team_id,
    status: status || 'active',
    matches_played: matches_played || 0,
    matches_won: matches_won || 0,
    matches_drawn: matches_drawn || 0,
    matches_lost: matches_lost || 0,
    goals_for: goals_for || 0,
    goals_against: goals_against || 0,
    points: points || 0,
    current_position: current_position || 0
  });
  res.status(201).json(newLeagueTeam);
};

export const updateLeagueTeam = async (req: Request, res: Response) => {
  const { status, matches_played, matches_won, matches_drawn, matches_lost, goals_for, goals_against, points, current_position } = req.body;

  await LeagueTeamService.updateLeagueTeam(req.params.id, {
    status,
    matches_played,
    matches_won,
    matches_drawn,
    matches_lost,
    goals_for,
    goals_against,
    points,
    current_position
  });
  res.status(200).json({ message: "League team updated successfully" });
};

export const deleteLeagueTeam = async (req: Request, res: Response) => {
  await LeagueTeamService.deleteLeagueTeam(req.params.id);
  res.status(204).send();
};

export const deleteLeagueTeamByLeagueAndTeam = async (req: Request, res: Response) => {
  const { leagueId, teamId } = req.params;
  await LeagueTeamService.deleteLeagueTeamByLeagueAndTeam(leagueId, teamId);
  res.status(204).send();
};

export const updateLeaguePositions = async (req: Request, res: Response) => {
  await LeagueTeamService.updateLeaguePositions(req.params.leagueId);
  res.status(200).json({ message: "League positions updated successfully" });
};

export const getLeagueStats = async (req: Request, res: Response) => {
  const stats = await LeagueTeamService.getLeagueStats(req.params.leagueId);
  res.json(stats);
};
