import { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

export interface TeamMember {
  id_team_member: string;
  id_user: string;
  id_team: string;
  role: 'captain' | 'admin' | 'member';
  join_date: string;
  username?: string;
  name?: string;
  avatar_url?: string;
}

export interface TeamChat {
  id_team_chat: string;
  message: string;
  sent_at: string;
  id_team: string;
  id_user: string;
  username?: string;
  avatar_url?: string;
  is_admin?: boolean;
}

export interface TeamDetails {
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
  verified?: boolean;
  is_recruiting?: boolean;
}

export interface TeamDetailsComplete extends TeamDetails {
  members: TeamMember[];
  chats: TeamChat[];
}

export const useTeamDetails = (teamId: string | undefined) => {
  const [teamDetails, setTeamDetails] = useState<TeamDetailsComplete | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamDetails = async () => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch team basic info, members, and chats in parallel
      const [team, members, chats] = await Promise.all([
        apiService.get<TeamDetails>(`/teams/${teamId}`),
        apiService.get<TeamMember[]>(`/team-members/team/${teamId}`),
        apiService.get<TeamChat[]>(`/team-chats/team/${teamId}`)
      ]);

      setTeamDetails({
        ...team,
        members: members || [],
        chats: chats || []
      });
    } catch (err: any) {
      console.error('Error fetching team details:', err);
      setError(err.response?.data?.message || 'Failed to fetch team details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  return {
    teamDetails,
    loading,
    error,
    refetch: fetchTeamDetails
  };
};

