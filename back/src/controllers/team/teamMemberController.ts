import { Request, Response } from "express";
import * as TeamMemberService from "../../services/team/teamMemberService";

export const getAllTeamMembers = async (req: Request, res: Response) => {
  const members = await TeamMemberService.getAllTeamMembers();
  res.json(members);
};

export const getUserTeamByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_user } = req.params;
    const teamMember = await TeamMemberService.getUserTeamByUserId(id_user);

    if (teamMember) {
      res.json({ hasTeam: true, teamMember });
    } else {
      res.json({ hasTeam: false });
    }
  } catch (error) {
    console.error('Error fetching user team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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

export const getTeamMembersByTeamId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_team } = req.params;
    const members = await TeamMemberService.getTeamMembersByTeamId(id_team);
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTeamMemberRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role) {
      res.status(400).json({ message: "role is required" });
      return;
    }

    if (!['captain', 'admin', 'member'].includes(role)) {
      res.status(400).json({ message: "Invalid role. Must be 'captain', 'admin', or 'member'" });
      return;
    }

    await TeamMemberService.updateTeamMemberRole(id, role);
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error('Error updating team member role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
