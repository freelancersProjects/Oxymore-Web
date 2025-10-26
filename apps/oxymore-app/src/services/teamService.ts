import apiService from '../api/apiService';
import type { Team, BackendTeam, TeamMember } from '../types/team';

const transformTeam = (team: BackendTeam): Team => ({
  id: team.id_team,
  name: team.team_name,
  logo: team.team_logo_url,
  description: team.description || 'Aucune description disponible',
  members: team.members_count || 0,
  maxMembers: team.max_members || 10,
  captain: team.captain_name || 'Capitaine inconnu',
  isPremium: team.subscription_status || false,
  isVerified: team.verified || false,
  rating: 4.0,
  gamesPlayed: 0,
  winRate: 0,
  region: team.region || 'Non spécifié',
  id_game: team.id_game,
  entryType: team.entry_type,
  foundedDate: team.created_at || new Date().toISOString(),
  tags: [],
  isRecruiting: team.entry_type === 'open',
  requirements: []
});

export const teamService = {
  getAllTeams: async (): Promise<Team[]> => {
    try {
      const teams: BackendTeam[] = await apiService.get('/teams');
      return teams.map(transformTeam);
    } catch (error) {
      console.error('Error getting all teams:', error);
      throw error;
    }
  },

  createTeam: async (teamData: Partial<Team>, captainId: string): Promise<Team> => {
    try {
      const backendData = {
        team_name: teamData.name,
        team_logo_url: teamData.logo,
        team_banner_url: undefined,
        description: teamData.description,
        max_members: teamData.maxMembers,
        entry_type: teamData.entryType || 'open',
        id_captain: captainId,
        verified: teamData.isVerified || false,
        region: teamData.region,
        id_game: teamData.id_game || null
      };

      const team: BackendTeam = await apiService.post('/teams', backendData);
      return transformTeam(team);
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipe:', error);
      throw error;
    }
  },

  createTeamMember: async (userId: string): Promise<TeamMember> => {
    try {
      const teamMember: TeamMember = await apiService.post(`/team-members`, { userId });
      return teamMember;
    } catch (error) {
      console.error('Erreur lors de la création du membre de l\'équipe:', error);
      throw error;
    }
  }
};
