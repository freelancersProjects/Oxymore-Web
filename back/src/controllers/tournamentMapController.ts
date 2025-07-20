import { Request, Response } from "express";
import * as TournamentMapService from "../services/tournamentMapService";

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

export const deleteTournamentMap = async (req: Request, res: Response) => {
  await TournamentMapService.deleteTournamentMap(req.params.id);
  res.status(204).send();
};
