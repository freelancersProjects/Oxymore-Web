import { Request, Response } from "express";
import * as TeamMemberService from "../../services/team/teamMemberService";

export const getAllTeamMembers = async (req: Request, res: Response) => {
  const members = await TeamMemberService.getAllTeamMembers();
  res.json(members);
};

export const createTeamMember = async (req: Request, res: Response) => {
  const { role, included_in_team_premium, join_date, id_team, id_user } = req.body;
  if (!role || !id_team || !id_user) {
    res.status(400).json({ message: "role, id_team et id_user sont requis" });
    return;
  }
  const newMember = await TeamMemberService.createTeamMember({
    role,
    included_in_team_premium,
    join_date,
    id_team,
    id_user
  });
  res.status(201).json(newMember);
};

export const deleteTeamMember = async (req: Request, res: Response) => {
  await TeamMemberService.deleteTeamMember(req.params.id);
  res.status(204).send();
};
