import { Request, Response } from "express";
import * as UserBadgeService from "../services/userBadgeService";

export const getAllUserBadges = async (req: Request, res: Response) => {
  const badges = await UserBadgeService.getAllUserBadges();
  res.json(badges);
};

export const createUserBadge = async (req: Request, res: Response) => {
  const { unlocked_date, id_user, id_badge } = req.body;
  if (!id_user || !id_badge) {
    res.status(400).json({ message: "id_user et id_badge sont requis" });
    return;
  }
  const newBadge = await UserBadgeService.createUserBadge({
    unlocked_date,
    id_user,
    id_badge
  });
  res.status(201).json(newBadge);
};

export const deleteUserBadge = async (req: Request, res: Response) => {
  await UserBadgeService.deleteUserBadge(req.params.id);
  res.status(204).send();
};
