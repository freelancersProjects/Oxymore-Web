import { Request, Response } from "express";
import * as PinnedMessageTeamService from "../../services/pinnedMessage/pinnedMessageTeamService";

export const getAllPinnedMessageTeams = async (req: Request, res: Response) => {
  const pins = await PinnedMessageTeamService.getAllPinnedMessageTeams();
  res.json(pins);
};

export const createPinnedMessageTeam = async (req: Request, res: Response) => {
  const { pinned_at, id_team_chat, pinned_by } = req.body;
  if (!id_team_chat || !pinned_by) {
    res.status(400).json({ message: "id_team_chat et pinned_by sont requis" });
    return;
  }
  const newPin = await PinnedMessageTeamService.createPinnedMessageTeam({
    pinned_at,
    id_team_chat,
    pinned_by
  });
  res.status(201).json(newPin);
};

export const deletePinnedMessageTeam = async (req: Request, res: Response) => {
  await PinnedMessageTeamService.deletePinnedMessageTeam(req.params.id);
  res.status(204).send();
};

export const getPinnedMessagesByTeamId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_team } = req.params;
    const pins = await PinnedMessageTeamService.getPinnedMessagesByTeamId(id_team);
    res.json(pins);
  } catch (error) {
    console.error('Error fetching pinned messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
