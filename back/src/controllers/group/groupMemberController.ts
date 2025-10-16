import { Request, Response } from "express";
import * as GroupMemberService from "../../services/group/groupMemberService";

export const getAllGroupMembers = async (req: Request, res: Response): Promise<void> => {
  const members = await GroupMemberService.getAllGroupMembers();
  res.json(members);
};

export const getGroupMembersByGroupId = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const members = await GroupMemberService.getGroupMembersByGroupId(groupId);
  res.json(members);
};

export const getPendingInvitationsByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const invitations = await GroupMemberService.getPendingInvitationsByUserId(userId);
  res.json(invitations);
};

export const createGroupMember = async (req: Request, res: Response): Promise<void> => {
  const { join_date, role, status, id_group, id_user } = req.body;
  if (!role || !id_group || !id_user) {
    res.status(400).json({ message: "role, id_group et id_user sont requis" });
    return;
  }
  const newMember = await GroupMemberService.createGroupMember({
    join_date,
    role,
    status,
    id_group,
    id_user
  });
  res.status(201).json(newMember);
};

export const updateGroupMemberStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['accepted', 'rejected'].includes(status)) {
    res.status(400).json({ message: "status doit être 'accepted' ou 'rejected'" });
    return;
  }

  const updatedMember = await GroupMemberService.updateGroupMemberStatus(id, status);
  if (updatedMember) {
    res.json(updatedMember);
  } else {
    res.status(404).json({ message: "Membre de groupe non trouvé" });
  }
};

export const inviteFriendToGroup = async (req: Request, res: Response): Promise<void> => {
  const { groupId, userId } = req.params;
  const { role = 'member' } = req.body;

  try {
    const invitation = await GroupMemberService.inviteFriendToGroup(groupId, userId, role);
    res.status(201).json(invitation);
  } catch (error) {
    if (error instanceof Error && error.message === 'User already invited to this group') {
      res.status(409).json({ message: "L'utilisateur est déjà invité à ce groupe" });
    } else {
      res.status(500).json({ message: "Erreur lors de l'invitation" });
    }
  }
};

export const deleteGroupMember = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await GroupMemberService.deleteGroupMember(id);
  res.status(204).send();
};
