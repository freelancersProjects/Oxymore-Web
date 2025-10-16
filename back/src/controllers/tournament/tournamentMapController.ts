import { Request, Response } from "express";
import * as TournamentMapService from "../../services/tournament/tournamentMapService";

export const getAllTournamentMaps = async (req: Request, res: Response) => {
  const maps = await TournamentMapService.getAllTournamentMaps();
  res.json(maps);
};

export const createTournamentMap = async (req: Request, res: Response) => {
  const { id_tournament, id_map } = req.body;
  if (!id_tournament || !id_map) {
    res.status(400).json({ message: "id_tournament et id_map sont requis" });
    return;
  }
  const newMap = await TournamentMapService.createTournamentMap({
    id_tournament,
    id_map
  });
  res.status(201).json(newMap);
};

export const getTournamentMapsByTournamentId = async (req: Request, res: Response) => {
  try {
    const maps = await TournamentMapService.getTournamentMapsByTournamentId(req.params.id);
    res.json(maps);
  } catch (error: any) {
    console.error('Error fetching tournament maps:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteTournamentMap = async (req: Request, res: Response) => {
  try {
    const deleted = await TournamentMapService.deleteTournamentMapsByTournamentId(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Tournament maps not found" });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting tournament maps:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
