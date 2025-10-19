import { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

export interface Team {
  id_team: string;
  team_name: string;
  team_logo_url?: string;
  team_banner_url?: string;
  description?: string;
  max_members?: number;
  entry_type: 'open' | 'inscription' | 'cv';
  id_captain: string;
  captain_name?: string;
  members_count?: number;
  subscription_status?: boolean;
  created_at?: string;
}

export interface TeamsStats {
  totalTeams: number;
  premiumTeams: number;
  activeMembers: number;
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<TeamsStats>({
    totalTeams: 0,
    premiumTeams: 0,
    activeMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.get<Team[]>('/teams');
      const teamsData = response || [];

      // Calculer les statistiques
      const totalTeams = teamsData.length;
      const premiumTeams = teamsData.filter(team => team.subscription_status).length;
      const activeMembers = teamsData.reduce((sum, team) => sum + (team.members_count || 0), 0);

      setTeams(teamsData);
      setStats({
        totalTeams,
        premiumTeams,
        activeMembers
      });
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const searchTeams = async (query: string) => {
    if (!query.trim()) {
      await fetchTeams();
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.get<Team[]>(`/teams/search?q=${encodeURIComponent(query)}`);
      setTeams(response || []);
    } catch (err) {
      console.error('Error searching teams:', err);
      setError('Failed to search teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    stats,
    loading,
    error,
    fetchTeams,
    searchTeams
  };
};
