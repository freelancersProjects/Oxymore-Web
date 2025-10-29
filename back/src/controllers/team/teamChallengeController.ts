import { Request, Response } from 'express';
import {
  createTeamChallenge,
  getTeamChallengesByTeamId,
  getTeamChallengeById,
  updateTeamChallengeStatus,
  updateTeamChallengeScheduledDate,
  deleteTeamChallenge
} from '../../services/team/teamChallengeService';
import { CreateTeamChallengeInput } from '../../interfaces/team/teamChallengeInterfaces';

export const createChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_team_challenger, id_team_challenged, scheduled_date }: CreateTeamChallengeInput = req.body;

    if (!id_team_challenger || !id_team_challenged) {
      res.status(400).json({ error: 'id_team_challenger et id_team_challenged sont requis' });
      return;
    }

    const challenge = await createTeamChallenge({
      id_team_challenger,
      id_team_challenged,
      scheduled_date
    });

    res.status(201).json(challenge);
  } catch (error: any) {
    console.error('Error creating team challenge:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de la création du défi' });
  }
};

export const getChallengesByTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      res.status(400).json({ error: 'teamId est requis' });
      return;
    }

    const challenges = await getTeamChallengesByTeamId(teamId);
    res.status(200).json(challenges);
  } catch (error: any) {
    console.error('Error getting team challenges:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des défis' });
  }
};

export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'id est requis' });
      return;
    }

    const challenge = await getTeamChallengeById(id);

    if (!challenge) {
      res.status(404).json({ error: 'Défi non trouvé' });
      return;
    }

    res.status(200).json(challenge);
  } catch (error: any) {
    console.error('Error getting team challenge:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du défi' });
  }
};

export const updateChallengeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      res.status(400).json({ error: 'id est requis' });
      return;
    }

    if (!status || !['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ error: 'status valide est requis' });
      return;
    }

    await updateTeamChallengeStatus(id, status);

    const challenge = await getTeamChallengeById(id);
    res.status(200).json(challenge);
  } catch (error: any) {
    console.error('Error updating challenge status:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut du défi' });
  }
};

export const updateChallengeScheduledDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { scheduled_date } = req.body;

    if (!id) {
      res.status(400).json({ error: 'id est requis' });
      return;
    }

    await updateTeamChallengeScheduledDate(id, scheduled_date || null);

    const challenge = await getTeamChallengeById(id);
    res.status(200).json(challenge);
  } catch (error: any) {
    console.error('Error updating challenge scheduled date:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la date du défi' });
  }
};

export const deleteChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'id est requis' });
      return;
    }

    await deleteTeamChallenge(id);
    res.status(200).json({ message: 'Défi supprimé avec succès' });
  } catch (error: any) {
    console.error('Error deleting team challenge:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du défi' });
  }
};


