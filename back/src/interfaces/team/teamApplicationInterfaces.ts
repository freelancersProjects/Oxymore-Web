export interface TeamApplication {
  id_team_application: string;
  id_team: string;
  id_user: string;
  subject?: string | null;
  message?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface TeamApplicationData {
  id_team_application: string;
  id_team: string;
  id_user: string;
  subject?: string | null;
  message?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CreateTeamApplicationInput {
  id_team: string;
  id_user: string;
  subject?: string;
  message?: string;
}

export interface TeamApplicationWithUser extends TeamApplication {
  username?: string;
  avatar_url?: string;
  team_name?: string;
}


