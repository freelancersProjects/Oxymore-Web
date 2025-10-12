import { Request, Response } from "express";
import * as MapPickbanService from "../../services/game/mapPickbanService";

export const getAllMapPickbans = async (req: Request, res: Response) => {
  const pickbans = await MapPickbanService.getAllMapPickbans();
  res.json(pickbans);
};

export const createMapPickban = async (req: Request, res: Response) => {
  const { action, order, id_match, id_team, id_map } = req.body;
  if (!action || order === undefined || !id_match || !id_team || !id_map) {
    res.status(400).json({ message: "action, order, id_match, id_team, id_map sont requis" });
    return;
  }
  const newPickban = await MapPickbanService.createMapPickban({
    action,
    order,
    id_match,
    id_team,
    id_map
  });
  res.status(201).json(newPickban);
};

export const deleteMapPickban = async (req: Request, res: Response) => {
  await MapPickbanService.deleteMapPickban(req.params.id);
  res.status(204).send();
};
