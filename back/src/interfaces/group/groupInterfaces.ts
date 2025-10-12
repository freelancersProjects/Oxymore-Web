import { RowDataPacket } from 'mysql2';

export interface Group extends RowDataPacket {
  id_group: string;
  group_name: string;
  description?: string;
  is_private?: boolean;
  created_at?: string;
  id_owner: string;
}

export interface GroupInput {
  group_name: string;
  description?: string;
  is_private?: boolean;
  created_at?: string;
  id_owner: string;
}

export interface GroupData {
  id_group: string;
  group_name: string;
  description?: string;
  is_private?: boolean;
  created_at?: string;
  id_owner: string;
}

export interface GroupMember extends RowDataPacket {
  id_group_member: string;
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  status?: string;
  id_group: string;
  id_user: string;
}

export interface GroupMemberData {
  id_group_member: string;
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  status?: string;
  id_group: string;
  id_user: string;
}

export interface GroupMemberInput {
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  status?: string;
  id_group: string;
  id_user: string;
}
