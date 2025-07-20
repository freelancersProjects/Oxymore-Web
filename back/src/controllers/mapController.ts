import { Request, Response } from "express";
import * as MapService from "../services/mapService";

export const getAllMaps = async (req: Request, res: Response) => {
  const maps = await MapService.getAllMaps();
  res.json(maps);
};

export const createMap = async (req: Request, res: Response) => {
  const { map_name, map_code, image_url } = req.body;
  if (!map_name || !map_code) {
    res.status(400).json({ message: "map_name et map_code sont requis" });
    return;
  }
  const newMap = await MapService.createMap({
    map_name,
    map_code,
    image_url
  });
  res.status(201).json(newMap);
};

export const deleteMap = async (req: Request, res: Response) => {
  await MapService.deleteMap(req.params.id);
  res.status(204).send();
};
