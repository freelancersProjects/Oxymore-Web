import { Request, Response } from "express";
import * as BadgeService from "../services/badgeService";

export const getAllBadges = async (req: Request, res: Response) => {
  const badges = await BadgeService.getAllBadges();
  res.json(badges);
};

export const createBadge = async (req: Request, res: Response) => {
  const { badge_name, badge_description, image_url, unlock_condition } = req.body;
  if (!badge_name) {
    res.status(400).json({ message: "badge_name est requis" });
    return;
  }
  const newBadge = await BadgeService.createBadge({
    badge_name,
    badge_description,
    image_url,
    unlock_condition
  });
  res.status(201).json(newBadge);
};

export const deleteBadge = async (req: Request, res: Response) => {
  await BadgeService.deleteBadge(req.params.id);
  res.status(204).send();
};
