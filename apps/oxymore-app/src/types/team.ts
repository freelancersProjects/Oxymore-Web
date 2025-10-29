export interface Team {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  description: string;
  members: number;
  maxMembers: number;
  captain: string;
  id_captain?: string;
  isPremium: boolean;
  isVerified: boolean;
  rating: number;
  gamesPlayed: number;
  winRate: number;
  region: string;
  id_game?: string;
  entryType: 'open' | 'inscription' | 'cv';
  foundedDate: string;
  tags: string[];
  isRecruiting: boolean;
  requirements: string[];
}

export interface TeamSearchProps {
  onTeamSelect?: (team: Team) => void;
}

// Interface pour les données brutes du backend
export interface BackendTeam {
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
  region?: string;
  id_game?: string;
}

export interface TeamMember {
  id_team_member: string;
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  id_team: string;
  id_user: string;
}

export interface TeamMemberResponse extends TeamMember {
  username?: string;
  avatar_url?: string;
  name?: string;
}

export interface TeamChatResponse {
  id_team_chat: string;
  id_user: string;
  id_team: string;
  message: string;
  sent_at: string;
  username?: string;
  avatar_url?: string;
  is_admin?: boolean;
}

export interface PinnedMessageTeam {
  id_pinned_message_team: string;
  id_team_chat: string;
  id_team: string;
  pinned_by: string;
  pinned_at: string;
  username?: string;
  avatar_url?: string;
  message?: string;
  id_user?: string;
}

export interface TeamMemberDetailed {
  id_user: string;
  username: string;
  name?: string;
  avatar?: string;
  role?: string;
  id_team_member?: string;
  join_date?: string;
}

export interface TeamApplication {
  id_team_application: string;
  id_team: string;
  id_user: string;
  subject?: string | null;
  message?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
  username?: string;
  avatar_url?: string;
  team_name?: string;
}
