import { Request, Response } from "express";
import * as badgeService from "../services/badgeService";

export const getAllBadges = async (req: Request, res: Response) => {
  try {
    const badges = await badgeService.getAllBadges();
    res.json(badges);
  } catch (error) {
    console.error("Error in getAllBadges:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBadgeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const badge = await badgeService.getBadgeById(id);
    
    if (!badge) {
      return res.status(404).json({ error: "Badge not found" });
    }
    
    res.json(badge);
  } catch (error) {
    console.error("Error in getBadgeById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBadge = async (req: Request, res: Response) => {
  try {
    const badge = await badgeService.createBadge(req.body);
    res.status(201).json(badge);
  } catch (error) {
    console.error("Error in createBadge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBadge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await badgeService.updateBadge(id, req.body);
    
    const updatedBadge = await badgeService.getBadgeById(id);
    if (!updatedBadge) {
      return res.status(404).json({ error: "Badge not found" });
    }
    
    res.json(updatedBadge);
  } catch (error) {
    console.error("Error in updateBadge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBadge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await badgeService.deleteBadge(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteBadge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
