export interface Group {
  id_group: string;
  group_name: string;
  description?: string;
  is_private?: boolean;
  created_at?: string;
  id_owner: string;
}

export interface GroupMember {
  id_group_member: string;
  join_date?: string;
  role: 'member' | 'admin' | 'owner';
  status: 'pending' | 'accepted' | 'rejected';
  id_group: string;
  id_user: string;
}

export interface GroupInvitation extends GroupMember {
  group_name: string;
  description?: string;
  username: string;
  avatar_url?: string;
}

export interface GroupMemberWithUser extends GroupMember {
  username: string;
  avatar_url?: string;
  elo: number;
  online_status?: string;
}
