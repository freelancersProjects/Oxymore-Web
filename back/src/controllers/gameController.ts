import { Request, Response } from 'express';
import * as GameService from '../services/gameService';

export const getAllGamesController = async (req: Request, res: Response) => {
  try {
    const games = await GameService.getAllGames();
    res.json(games);
  } catch (error) {
    console.error('Error in getAllGamesController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGameByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Game ID is required' });
      return;
    }

    const game = await GameService.getGameById(id);

    if (!game) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    res.json(game);
  } catch (error) {
    console.error('Error in getGameByIdController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
