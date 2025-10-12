import { RowDataPacket } from 'mysql2';

export interface Team extends RowDataPacket {
  id_team: string;
  team_name: string;
  team_logo_url?: string;
  team_banner_url?: string;
  description?: string;
  max_members?: number;
  entry_type: 'open' | 'inscription' | 'cv';
  id_captain: string;
}

export interface TeamData {
  id_team: string;
  team_name: string;
  team_logo_url?: string;
  team_banner_url?: string;
  description?: string;
  max_members?: number;
  entry_type: 'open' | 'inscription' | 'cv';
  id_captain: string;
}

export interface TeamMemberData {
  id_team_member: string;
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  id_team: string;
  id_user: string;
}

export interface TeamMember extends RowDataPacket {
  id_team_member: string;
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  id_team: string;
  id_user: string;
}

export interface TeamChat extends RowDataPacket {
  id_team_chat: string;
  message: string;
  sent_at?: string;
  id_team: string;
  id_user: string;
}

export interface TeamChatInput {
  message: string;
  sent_at?: string;
  id_team: string;
  id_user: string;
}

export interface TeamChatData {
  id_team_chat: string;
  message: string;
  sent_at?: string;
  id_team: string;
  id_user: string;
}

export interface TeamSubscription extends RowDataPacket {
  id_team_subscription: string;
  start_date: string;
  end_date: string;
  active?: boolean;
  id_team: string;
  purchased_by: string;
}

export interface TeamSubscriptionInput {
  start_date: string;
  end_date: string;
  active?: boolean;
  id_team: string;
  purchased_by: string;
}

export interface TeamSubscriptionData {
  id_team_subscription: string;
  start_date: string;
  end_date: string;
  active?: boolean;
  id_team: string;
  purchased_by: string;
}
