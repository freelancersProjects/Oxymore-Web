import { Request, Response } from "express";
import * as TournamentTeamService from "../../services/tournament/tournamentTeamService";

export const getAllTournamentTeams = async (req: Request, res: Response) => {
  const tournamentTeams = await TournamentTeamService.getAllTournamentTeams();
  res.json(tournamentTeams);
};

export const getTournamentTeamById = async (req: Request, res: Response) => {
  const tournamentTeam = await TournamentTeamService.getTournamentTeamById(req.params.id);
  if (!tournamentTeam) {
    res.status(404).json({ message: "Tournament team not found" });
    return;
  }
  res.json(tournamentTeam);
};

export const getTournamentTeamsByTournamentId = async (req: Request, res: Response) => {
  const tournamentTeams = await TournamentTeamService.getTournamentTeamsByTournamentId(req.params.tournamentId);
  res.json(tournamentTeams);
};

export const getTournamentTeamsByTeamId = async (req: Request, res: Response) => {
  const tournamentTeams = await TournamentTeamService.getTournamentTeamsByTeamId(req.params.teamId);
  res.json(tournamentTeams);
};

export const getTournamentTeamByTournamentAndTeam = async (req: Request, res: Response) => {
  const { tournamentId, teamId } = req.params;
  const tournamentTeam = await TournamentTeamService.getTournamentTeamByTournamentAndTeam(tournamentId, teamId);
  if (!tournamentTeam) {
    res.status(404).json({ message: "Tournament team not found" });
    return;
  }
  res.json(tournamentTeam);
};

export const createTournamentTeam = async (req: Request, res: Response) => {
  const { tournament_id, team_id, status, seed_position, final_position, matches_played, matches_won, matches_lost, matches_drawn, points_earned } = req.body;

  if (!tournament_id || !team_id) {
    res.status(400).json({ message: "tournament_id et team_id sont requis" });
    return;
  }

  const newTournamentTeam = await TournamentTeamService.createTournamentTeam({
    tournament_id,
    team_id,
    status: status || 'registered',
    seed_position: seed_position || null,
    final_position: final_position || null,
    matches_played: matches_played || 0,
    matches_won: matches_won || 0,
    matches_lost: matches_lost || 0,
    matches_drawn: matches_drawn || 0,
    points_earned: points_earned || 0
  });
  res.status(201).json(newTournamentTeam);
};

export const updateTournamentTeam = async (req: Request, res: Response) => {
  const { status, seed_position, final_position, matches_played, matches_won, matches_lost, matches_drawn, points_earned } = req.body;

  await TournamentTeamService.updateTournamentTeam(req.params.id, {
    status,
    seed_position,
    final_position,
    matches_played,
    matches_won,
    matches_lost,
    matches_drawn,
    points_earned
  });
  res.status(200).json({ message: "Tournament team updated successfully" });
};

export const deleteTournamentTeam = async (req: Request, res: Response) => {
  await TournamentTeamService.deleteTournamentTeam(req.params.id);
  res.status(204).send();
};

export const deleteTournamentTeamByTournamentAndTeam = async (req: Request, res: Response) => {
  const { tournamentId, teamId } = req.params;
  await TournamentTeamService.deleteTournamentTeamByTournamentAndTeam(tournamentId, teamId);
  res.status(204).send();
};

export const getTournamentStats = async (req: Request, res: Response) => {
  const stats = await TournamentTeamService.getTournamentStats(req.params.tournamentId);
  res.json(stats);
};
