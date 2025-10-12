import { Request, Response } from "express";
import * as UserSanctionService from "../../services/user/userSanctionService";

export const getAllUserSanctions = async (req: Request, res: Response) => {
  const sanctions = await UserSanctionService.getAllUserSanctions();
  res.json(sanctions);
};

export const createUserSanction = async (req: Request, res: Response) => {
  const { reason, type, created_at, expires_at, id_user, id_admin } = req.body;
  if (!type || !id_user || !id_admin) {
    res.status(400).json({ message: "type, id_user et id_admin sont requis" });
    return;
  }
  const newSanction = await UserSanctionService.createUserSanction({
    reason,
    type,
    created_at,
    expires_at,
    id_user,
    id_admin
  });
  res.status(201).json(newSanction);
};

export const deleteUserSanction = async (req: Request, res: Response) => {
  await UserSanctionService.deleteUserSanction(req.params.id);
  res.status(204).send();
};
