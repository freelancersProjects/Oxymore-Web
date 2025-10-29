export interface TeamChallenge {
  id_team_challenge: string;
  id_team_challenger: string;
  id_team_challenged: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  scheduled_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TeamChallengeData {
  id_team_challenge: string;
  id_team_challenger: string;
  id_team_challenged: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamChallengeInput {
  id_team_challenger: string;
  id_team_challenged: string;
  scheduled_date?: string;
}

export interface TeamChallengeWithTeamInfo extends TeamChallenge {
  challenger_team_name?: string;
  challenger_team_logo?: string;
  challenged_team_name?: string;
  challenged_team_logo?: string;
}


