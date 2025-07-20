import { Request, Response } from "express";
import * as GroupService from "../services/groupService";

export const getAllGroups = async (req: Request, res: Response) => {
  const groups = await GroupService.getAllGroups();
  res.json(groups);
};

export const createGroup = async (req: Request, res: Response) => {
  const { group_name, description, is_private, created_at, id_owner } = req.body;
  if (!group_name || !id_owner) {
    res.status(400).json({ message: "group_name et id_owner sont requis" });
    return;
  }
  const newGroup = await GroupService.createGroup({
    group_name,
    description,
    is_private,
    created_at,
    id_owner
  });
  res.status(201).json(newGroup);
};

export const deleteGroup = async (req: Request, res: Response) => {
  await GroupService.deleteGroup(req.params.id);
  res.status(204).send();
};
