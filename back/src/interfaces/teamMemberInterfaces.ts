export interface TeamMember {
  id_team_member: string;
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  id_team: string;
  id_user: string;
}

export interface TeamMemberInput {
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  id_team: string;
  id_user: string;
}

export interface TeamMemberUpdate {
  role?: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  id_team?: string;
  id_user?: string;
}

export interface TeamMemberStats {
  total_members: number;
  active_members: number;
  premium_members: number;
  average_team_size: number;
  members_this_month: number;
}
