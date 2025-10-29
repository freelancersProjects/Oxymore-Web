import { Request, Response } from 'express';
import {
  createTeamApplication,
  getTeamApplicationsByTeamId,
  getTeamApplicationsByUserId,
  getTeamApplicationById,
  updateTeamApplicationStatus,
  deleteTeamApplication
} from '../../services/team/teamApplicationService';
import { CreateTeamApplicationInput } from '../../interfaces/team/teamApplicationInterfaces';

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_team, id_user, subject, message }: CreateTeamApplicationInput = req.body;

    if (!id_team || !id_user) {
      res.status(400).json({ error: 'id_team and id_user are required' });
      return;
    }

    const application = await createTeamApplication({
      id_team,
      id_user,
      subject,
      message
    });

    res.status(201).json(application);
  } catch (error: any) {
    console.error('Error creating team application:', error);
    res.status(500).json({ error: 'Error creating team application', message: error.message });
  }
};

export const getApplicationsByTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      res.status(400).json({ error: 'teamId is required' });
      return;
    }

    const applications = await getTeamApplicationsByTeamId(teamId);
    res.status(200).json(applications);
  } catch (error: any) {
    console.error('Error getting team applications:', error);
    res.status(500).json({ error: 'Error getting team applications', message: error.message });
  }
};

export const getApplicationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const applications = await getTeamApplicationsByUserId(userId);
    res.status(200).json(applications);
  } catch (error: any) {
    console.error('Error getting user applications:', error);
    res.status(500).json({ error: 'Error getting user applications', message: error.message });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'id is required' });
      return;
    }

    const application = await getTeamApplicationById(id);
    if (!application) {
      res.status(404).json({ error: 'Team application not found' });
      return;
    }

    res.status(200).json(application);
  } catch (error: any) {
    console.error('Error getting team application:', error);
    res.status(500).json({ error: 'Error getting team application', message: error.message });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      res.status(400).json({ error: 'id and status are required' });
      return;
    }

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'status must be pending, accepted, or rejected' });
      return;
    }

    await updateTeamApplicationStatus(id, status);
    res.status(200).json({ message: 'Team application status updated successfully' });
  } catch (error: any) {
    console.error('Error updating team application status:', error);
    res.status(500).json({ error: 'Error updating team application status', message: error.message });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'id is required' });
      return;
    }

    await deleteTeamApplication(id);
    res.status(200).json({ message: 'Team application deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting team application:', error);
    res.status(500).json({ error: 'Error deleting team application', message: error.message });
  }
};


