export interface Team {
  id_team: string;
  team_name: string;
  team_logo_url?: string;
  team_banner_url?: string;
  description?: string;
  max_members?: number;
  id_captain: string;
}

export interface TeamInput {
  team_name: string;
  team_logo_url?: string;
  team_banner_url?: string;
  description?: string;
  max_members?: number;
  id_captain: string;
}

export interface TeamUpdate {
  team_name?: string;
  team_logo_url?: string;
  team_banner_url?: string;
  description?: string;
  max_members?: number;
  id_captain?: string;
}

export interface TeamStats {
  total_teams: number;
  active_teams: number;
  teams_with_captains: number;
  average_team_size: number;
  teams_this_month: number;
}
