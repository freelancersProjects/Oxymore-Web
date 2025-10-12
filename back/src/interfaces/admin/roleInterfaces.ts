export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleInput {
  name: string;
  description?: string;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
}

export interface RoleStats {
  total_roles: number;
  active_roles: number;
  roles_with_description: number;
  most_used_role: string;
}
