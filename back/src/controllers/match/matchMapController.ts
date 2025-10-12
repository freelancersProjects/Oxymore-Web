import { Request, Response } from "express";
import * as MatchMapService from "../../services/matchMapService";

export const getAllMatchMaps = async (req: Request, res: Response) => {
  const maps = await MatchMapService.getAllMatchMaps();
  res.json(maps);
};

export const createMatchMap = async (req: Request, res: Response) => {
  const { map_order, id_match, id_map, picked_by, winner_team } = req.body;
  if (!id_match || !id_map) {
    res.status(400).json({ message: "id_match et id_map sont requis" });
    return;
  }
  const newMatchMap = await MatchMapService.createMatchMap({
    map_order,
    id_match,
    id_map,
    picked_by,
    winner_team
  });
  res.status(201).json(newMatchMap);
};

export const deleteMatchMap = async (req: Request, res: Response) => {
  await MatchMapService.deleteMatchMap(req.params.id);
  res.status(204).send();
};
