import apiService from '../api/apiService';
import type { League, LeagueTeamWithDetails } from '../types/league';

export const leagueService = {
  getAllLeagues: async (): Promise<League[]> => {
    try {
      const leagues = await apiService.get('/leagues');
      return leagues;
    } catch (error) {
      console.error('Error getting all leagues:', error);
      throw error;
    }
  },

  getLeagueById: async (id: string): Promise<League> => {
    try {
      const league = await apiService.get(`/leagues/${id}`);
      return league;
    } catch (error) {
      console.error('Error getting league by id:', error);
      throw error;
    }
  },

  getLeagueTeams: async (leagueId: string): Promise<LeagueTeamWithDetails[]> => {
    try {
      const teams = await apiService.get(`/leagues/${leagueId}/teams`);
      return teams;
    } catch (error) {
      console.error('Error getting league teams:', error);
      return [];
    }
  }
};

