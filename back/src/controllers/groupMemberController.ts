import { Request, Response } from "express";
import * as GroupMemberService from "../services/groupMemberService";

export const getAllGroupMembers = async (req: Request, res: Response) => {
  const members = await GroupMemberService.getAllGroupMembers();
  res.json(members);
};

export const createGroupMember = async (req: Request, res: Response) => {
  const { join_date, role, id_group, id_user } = req.body;
  if (!role || !id_group || !id_user) {
    res.status(400).json({ message: "role, id_group et id_user sont requis" });
    return;
  }
  const newMember = await GroupMemberService.createGroupMember({
    join_date,
    role,
    id_group,
    id_user
  });
  res.status(201).json(newMember);
};

export const deleteGroupMember = async (req: Request, res: Response) => {
  await GroupMemberService.deleteGroupMember(req.params.id);
  res.status(204).send();
};
