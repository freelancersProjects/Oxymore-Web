import apiService from '../api/apiService';
import type { Tournament } from '../types/tournament';

export const tournamentService = {
  getAllTournaments: async (): Promise<Tournament[]> => {
    try {
      const tournaments = await apiService.get('/tournaments');
      return tournaments;
    } catch (error) {
      console.error('Error getting all tournaments:', error);
      throw error;
    }
  },

  getTournamentById: async (id: string): Promise<Tournament> => {
    try {
      const tournament = await apiService.get(`/tournaments/${id}`);
      return tournament;
    } catch (error) {
      console.error('Error getting tournament by id:', error);
      throw error;
    }
  },

  createTournament: async (tournamentData: Partial<Tournament>): Promise<Tournament> => {
    try {
      const tournament = await apiService.post('/tournaments', tournamentData);
      return tournament;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  },

  updateTournament: async (id: string, tournamentData: Partial<Tournament>): Promise<Tournament> => {
    try {
      const tournament = await apiService.put(`/tournaments/${id}`, tournamentData);
      return tournament;
    } catch (error) {
      console.error('Error updating tournament:', error);
      throw error;
    }
  },

  deleteTournament: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/tournaments/${id}`);
    } catch (error) {
      console.error('Error deleting tournament:', error);
      throw error;
    }
  }
};

