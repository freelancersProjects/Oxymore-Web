import apiService from '../api/apiService';
import type { Team, BackendTeam, TeamMember } from '../types/team';

const transformTeam = (team: BackendTeam): Team => ({
  id: team.id_team,
  name: team.team_name,
  logo: team.team_logo_url,
  banner: team.team_banner_url,
  description: team.description || 'Aucune description disponible',
  members: team.members_count || 0,
  maxMembers: team.max_members || 10,
  captain: team.captain_name || 'Capitaine inconnu',
  id_captain: team.id_captain,
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
  isRecruiting: team.is_recruiting || false,
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

    getTeamById: async (id: string): Promise<Team> => {
      try {
        const team: BackendTeam = await apiService.get(`/teams/${id}`);
        return transformTeam(team);
      } catch (error) {
      console.error('Error getting team by id:', error);
      throw error;
    }
  },

  createTeam: async (teamData: Partial<Team>, captainId: string): Promise<Team> => {
    try {
      const backendData = {
        team_name: String(teamData.name || ''),
        team_logo_url: teamData.logo || null,
        team_banner_url: null,
        description: String(teamData.description || ''),
        max_members: Number(teamData.maxMembers) || 10,
        entry_type: String(teamData.entryType || 'open'),
        id_captain: String(captainId),
        verified: Boolean(teamData.isVerified) || false,
        is_recruiting: Boolean(teamData.isRecruiting) || false,
        region: String(teamData.region || ''),
        id_game: teamData.id_game ? String(teamData.id_game) : null
      };

      const team: BackendTeam = await apiService.post('/teams', backendData);
      return transformTeam(team);
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  createTeamMember: async (userId: string): Promise<TeamMember> => {
    try {
      const teamMember: TeamMember = await apiService.post(`/team-members`, { userId });
      return teamMember;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  getUserTeam: async (userId: string): Promise<{ hasTeam: boolean; teamMember?: TeamMember }> => {
    try {
      const response = await apiService.get(`/team-members/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error getting user team:', error);
      throw error;
    }
  },

  getTeamMembersByTeamId: async (teamId: string): Promise<TeamMember[]> => {
    try {
      const members: TeamMember[] = await apiService.get(`/team-members/team/${teamId}`);
      return members;
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  },

  getTeamChats: async (teamId: string): Promise<any[]> => {
    try {
      const chats: any[] = await apiService.get(`/team-chats/team/${teamId}`);
      return chats;
    } catch (error) {
      console.error('Error getting team chats:', error);
      throw error;
    }
  },

  createTeamChat: async (message: string, teamId: string, userId: string, replyTo?: string): Promise<any> => {
    try {
      const chat = await apiService.post('/team-chats', {
        message,
        id_team: teamId,
        id_user: userId,
        sent_at: new Date().toISOString(),
        reply_to: replyTo || null
      });
      return chat;
    } catch (error) {
      console.error('Error creating team chat:', error);
      throw error;
    }
  },

  deleteTeamChat: async (messageId: string): Promise<void> => {
    try {
      await apiService.delete(`/team-chats/${messageId}`);
    } catch (error) {
      console.error('Error deleting team chat:', error);
      throw error;
    }
  },

  updateTeamChat: async (messageId: string, message: string): Promise<void> => {
    try {
      await apiService.patch(`/team-chats/${messageId}`, { message });
    } catch (error) {
      console.error('Error updating team chat:', error);
      throw error;
    }
  },

  pinMessage: async (_teamId: string, chatId: string, userId: string): Promise<any> => {
    try {
      return await apiService.post('/pinned-message-teams', {
        id_team_chat: chatId,
        pinned_by: userId,
        pinned_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error pinning message:', error);
      throw error;
    }
  },

  getPinnedMessages: async (teamId: string): Promise<any[]> => {
    try {
      return await apiService.get(`/pinned-message-teams/team/${teamId}`);
    } catch (error) {
      console.error('Error getting pinned messages:', error);
      throw error;
    }
  },

  unpinMessage: async (pinId: string): Promise<void> => {
    try {
      await apiService.delete(`/pinned-message-teams/${pinId}`);
    } catch (error) {
      console.error('Error unpinning message:', error);
      throw error;
    }
  },

  removeTeamMember: async (teamMemberId: string): Promise<void> => {
    try {
      await apiService.delete(`/team-members/${teamMemberId}`);
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  },

  updateTeamMemberRole: async (teamMemberId: string, role: string): Promise<void> => {
    try {
      await apiService.patch(`/team-members/${teamMemberId}/role`, { role });
    } catch (error) {
      console.error('Error updating team member role:', error);
      throw error;
    }
  },

  joinTeam: async (teamId: string, userId: string): Promise<void> => {
    try {
      await apiService.post(`/team-members`, {
        id_team: teamId,
        id_user: userId,
        role: 'member'
      });
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  },

  sendTeamApplication: async (teamId: string, userId: string): Promise<void> => {
    try {
      await apiService.post(`/team-applications`, {
        id_team: teamId,
        id_user: userId
      });
    } catch (error) {
      console.error('Error sending team application:', error);
      throw error;
    }
  },

  sendTeamCV: async (teamId: string, userId: string, subject: string, message: string): Promise<void> => {
    try {
      await apiService.post(`/team-applications`, {
        id_team: teamId,
        id_user: userId,
        subject,
        message
      });
    } catch (error) {
      console.error('Error sending team CV:', error);
      throw error;
    }
  },

  getTeamApplications: async (teamId: string): Promise<any[]> => {
    try {
      const applications = await apiService.get(`/team-applications/team/${teamId}`);
      return applications;
    } catch (error) {
      console.error('Error getting team applications:', error);
      throw error;
    }
  },

  updateApplicationStatus: async (applicationId: string, status: 'accepted' | 'rejected'): Promise<void> => {
    try {
      await apiService.patch(`/team-applications/${applicationId}/status`, { status });
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  getTeamChallenges: async (teamId: string): Promise<any[]> => {
    try {
      const challenges = await apiService.get(`/team-challenges/team/${teamId}`);
      return challenges;
    } catch (error) {
      console.error('Error getting team challenges:', error);
      throw error;
    }
  },

  updateTeam: async (teamId: string, data: Partial<Team>): Promise<Team> => {
    try {
      const updatePayload: any = {};
      if (data.name !== undefined) updatePayload.team_name = data.name;
      if (data.logo !== undefined) updatePayload.team_logo_url = data.logo;
      if (data.banner !== undefined) updatePayload.team_banner_url = data.banner;
      if (data.description !== undefined) updatePayload.description = data.description;
      if (data.maxMembers !== undefined) updatePayload.max_members = data.maxMembers;
      if (data.entryType !== undefined) updatePayload.entry_type = data.entryType;
      if (data.region !== undefined) updatePayload.region = data.region;

      const updatedTeam: BackendTeam = await apiService.patch(`/teams/${teamId}`, updatePayload);
      return transformTeam(updatedTeam);
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  },

  leaveTeam: async (teamId: string, userId: string): Promise<void> => {
    try {
      const members = await teamService.getTeamMembersByTeamId(teamId);
      const userMember = members.find((member: TeamMember) => member.id_user === userId);

      if (!userMember) {
        throw new Error('Vous n\'êtes pas membre de cette équipe');
      }

      await apiService.delete(`/team-members/${userMember.id_team_member}`);
    } catch (error) {
      console.error('Error leaving team:', error);
      throw error;
    }
  },

  reportTeamChat: async (id_team_chat: string, id_user: string, reason: string): Promise<void> => {
    try {
      await apiService.post('/team-chat-reports', {
        id_team_chat,
        id_user,
        reason
      });
    } catch (error) {
      console.error('Error reporting team chat:', error);
      throw error;
    }
  }
};
