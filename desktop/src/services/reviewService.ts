import apiService from '../api/apiService';
import type { Review, ReviewInput, ReviewStats } from '../types/review';

export const reviewService = {
  getAllReviews: async (): Promise<Review[]> => {
    try {
      const reviews = await apiService.get('/reviews');
      return reviews;
    } catch (error) {
      console.error('Error getting all reviews:', error);
      throw error;
    }
  },

  getReviewById: async (id: string): Promise<Review> => {
    try {
      const review = await apiService.get(`/reviews/${id}`);
      return review;
    } catch (error) {
      console.error('Error getting review by id:', error);
      throw error;
    }
  },

  getReviewsByUser: async (id_user: string): Promise<Review[]> => {
    try {
      const reviews = await apiService.get(`/reviews/user/${id_user}`);
      return reviews;
    } catch (error) {
      console.error('Error getting reviews by user:', error);
      throw error;
    }
  },

  getReviewsByTournament: async (id_tournament: string): Promise<Review[]> => {
    try {
      const reviews = await apiService.get(`/reviews/tournament/${id_tournament}`);
      return reviews;
    } catch (error) {
      console.error('Error getting reviews by tournament:', error);
      throw error;
    }
  },

  getGlobalReviews: async (): Promise<Review[]> => {
    try {
      const reviews = await apiService.get('/reviews/global');
      return reviews;
    } catch (error) {
      console.error('Error getting global reviews:', error);
      throw error;
    }
  },

  createReview: async (reviewData: ReviewInput): Promise<Review> => {
    try {
      const review = await apiService.post('/reviews', reviewData);
      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  updateReview: async (id: string, reviewData: Partial<ReviewInput>): Promise<Review> => {
    try {
      const review = await apiService.put(`/reviews/${id}`, reviewData);
      return review;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/reviews/${id}`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  getReviewStats: async (): Promise<ReviewStats> => {
    try {
      const stats = await apiService.get('/reviews/stats');
      return stats;
    } catch (error) {
      console.error('Error getting review stats:', error);
      throw error;
    }
  }
};

