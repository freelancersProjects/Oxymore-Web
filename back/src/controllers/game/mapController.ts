import { Request, Response } from "express";
import * as MapService from "../../services/game/mapService";

export const getAllMaps = async (req: Request, res: Response) => {
  const maps = await MapService.getAllMaps();
  res.json(maps);
};

export const createMap = async (req: Request, res: Response) => {
  const { map_name, image_url } = req.body;
  if (!map_name) {
    res.status(400).json({ message: "map_name est requis" });
    return;
  }
  const newMap = await MapService.createMap({
    map_name,
    image_url
  });
  res.status(201).json(newMap);
};

export const deleteMap = async (req: Request, res: Response) => {
  await MapService.deleteMap(req.params.id);
  res.status(204).send();
};
