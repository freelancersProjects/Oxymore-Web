import { db } from "../../config/db";

export interface Role {
  id: number;
  name: string;
}

export const getUserRole = async (userId: string): Promise<Role | null> => {
  const [rows] = await db.query(
    `SELECT r.* FROM roles r
     INNER JOIN users u ON u.role_id = r.id
     WHERE u.id_user = ?`,
    [userId]
  );
  const roles = rows as Role[];
  return roles.length > 0 ? roles[0] : null;
};

export const updateUserRole = async (userId: string, roleId: number): Promise<boolean> => {
  const [result] = await db.query(
    "UPDATE users SET role_id = ? WHERE id_user = ?",
    [roleId, userId]
  );
  return (result as any).affectedRows > 0;
}; 

