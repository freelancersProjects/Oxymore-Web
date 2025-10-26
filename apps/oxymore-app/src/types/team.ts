export interface Team {
  id: string;
  name: string;
  logo?: string;
  description: string;
  members: number;
  maxMembers: number;
  captain: string;
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
