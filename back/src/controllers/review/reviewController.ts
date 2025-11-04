import { Request, Response } from 'express';
import * as ReviewService from '../../services/review/reviewService';

export const getAllReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await ReviewService.getAllReviews();
    res.json(reviews);
  } catch (error: any) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await ReviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error: any) {
    console.error('Error getting review by id:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getReviewsByUser = async (req: Request, res: Response) => {
  try {
    const reviews = await ReviewService.getReviewsByUser(req.params.id_user);
    res.json(reviews);
  } catch (error: any) {
    console.error('Error getting reviews by user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getReviewsByTournament = async (req: Request, res: Response) => {
  try {
    const reviews = await ReviewService.getReviewsByTournament(req.params.id_tournament);
    res.json(reviews);
  } catch (error: any) {
    console.error('Error getting reviews by tournament:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getGlobalReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await ReviewService.getGlobalReviews();
    res.json(reviews);
  } catch (error: any) {
    console.error('Error getting global reviews:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { id_team, id_tournament, rating, comment } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!rating) {
      return res.status(400).json({ message: 'rating is required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    let validTournamentId: string | null = null;
    if (id_tournament !== undefined && id_tournament !== null && id_tournament !== 'string' && id_tournament !== '') {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id_tournament)) {
        validTournamentId = id_tournament;
      } else {
        return res.status(400).json({ message: 'Invalid tournament ID format. Must be a valid UUID or null for global reviews.' });
      }
    }

    const newReview = await ReviewService.createReview({
      id_user: req.user.id, // Utilise l'ID de l'utilisateur authentifié
      id_team, //team dans laquelle l'utilisateur se trouve
      id_tournament: validTournamentId || undefined, // NULL = avis global, rempli = avis spécifique tournoi
      rating,
      comment
    });

    res.status(201).json(newReview);
  } catch (error: any) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await ReviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.id_user !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }

    const updatedReview = await ReviewService.updateReview(req.params.id, {
      rating,
      comment
    });

    res.json(updatedReview);
  } catch (error: any) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const review = await ReviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.id_user !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    const deleted = await ReviewService.deleteReview(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getReviewStats = async (_req: Request, res: Response) => {
  try {
    const stats = await ReviewService.getReviewStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error getting review stats:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

