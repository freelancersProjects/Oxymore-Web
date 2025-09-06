import { Request, Response } from 'express';
import UserStatsService from '../services/userStatsService';

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const statsService = UserStatsService.getInstance();
    const statsComparison = await statsService.getStatsWithComparison();

    res.json({
      success: true,
      data: statsComparison
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques utilisateurs'
    });
  }
};

export const refreshUserStats = async (req: Request, res: Response) => {
  try {
    const statsService = UserStatsService.getInstance();
    const statsComparison = await statsService.refreshStats();

    res.json({
      success: true,
      data: statsComparison
    });
  } catch (error) {
    console.error('Error refreshing user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des statistiques utilisateurs'
    });
  }
};
