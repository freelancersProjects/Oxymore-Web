import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import { Role } from '../interfaces/roleInterfaces';

export const createRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> => {
  const id = uuidv4();
  const now = new Date();

  return {
    id,
    name: roleData.name,
    description: roleData.description,
    createdAt: now,
    updatedAt: now
  };
};

export const getRoleById = async (id: string): Promise<Role | null> => {
  const [rows] = await db.execute('SELECT * FROM roles WHERE id = ?', [id]);
  const roles = rows as Role[];
  return roles.length > 0 ? roles[0] : null;
};

export const getRoleByName = async (name: string): Promise<Role | null> => {
  const [rows] = await db.execute('SELECT * FROM roles WHERE name = ?', [name]);
  const roles = rows as Role[];
  return roles.length > 0 ? roles[0] : null;
};

export const getAllRoles = async (): Promise<Role[]> => {
  const [rows] = await db.execute('SELECT * FROM roles ORDER BY createdAt DESC');
  return rows as Role[];
};

export const updateRole = async (id: string, roleData: Partial<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Role | null> => {
  const now = new Date();
  const updates: string[] = [];
  const values: any[] = [];

  if (roleData.name !== undefined) {
    updates.push('name = ?');
    values.push(roleData.name);
  }
  if (roleData.description !== undefined) {
    updates.push('description = ?');
    values.push(roleData.description);
  }

  updates.push('updatedAt = ?');
  values.push(now);
  values.push(id);

  return getRoleById(id);
};

export const deleteRole = async (id: string): Promise<boolean> => {
  const [result] = await db.execute('DELETE FROM roles WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
};

export default {
  createRole,
  getRoleById,
  getRoleByName,
  getAllRoles,
  updateRole,
  deleteRole
};
