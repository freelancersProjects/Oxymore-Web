import { Group, GroupData } from "../../interfaces/group/groupInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllGroups = async (): Promise<Group[]> => {
  const [rows] = await db.query("SELECT * FROM `group`");
  return rows as Group[];
};

export const createGroup = async (data: { group_name: string; description?: string; is_private?: boolean; created_at?: string; id_owner: string }): Promise<GroupData> => {
  const id_group = crypto.randomUUID();
  await db.query(
    "INSERT INTO `group` (id_group, group_name, description, is_private, created_at, id_owner) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_group,
      data.group_name,
      data.description ?? null,
      data.is_private ?? false,
      data.created_at ?? new Date().toISOString(),
      data.id_owner
    ]
  );
  return {
    id_group,
    group_name: data.group_name,
    description: data.description,
    is_private: data.is_private ?? false,
    created_at: data.created_at ?? new Date().toISOString(),
    id_owner: data.id_owner
  };
};

export const deleteGroup = async (id_group: string): Promise<void> => {
  await db.query("DELETE FROM `group` WHERE id_group = ?", [id_group]);
};

export const getGroupsByUserId = async (userId: string): Promise<Group[]> => {
  const [rows] = await db.query(`
    SELECT g.* FROM \`group\` g
    INNER JOIN group_member gm ON g.id_group = gm.id_group
    WHERE gm.id_user = ? AND gm.status = 'accepted'
  `, [userId]);
  return rows as Group[];
};

export const getGroupsOwnedByUserId = async (userId: string): Promise<Group[]> => {
  const [rows] = await db.query("SELECT * FROM `group` WHERE id_owner = ?", [userId]);
  return rows as Group[];
};

export const getGroupById = async (id_group: string): Promise<Group | null> => {
  const [rows] = await db.query("SELECT * FROM `group` WHERE id_group = ?", [id_group]);
  const groups = rows as Group[];
  return groups.length > 0 ? groups[0] : null;
};

export const updateGroup = async (id_group: string, data: { group_name?: string; description?: string; is_private?: boolean }): Promise<Group | null> => {
  const group = await getGroupById(id_group);
  if (!group) return null;

  const updateFields: string[] = [];
  const updateValues: any[] = [];

  if (data.group_name !== undefined) {
    updateFields.push("group_name = ?");
    updateValues.push(data.group_name);
  }

  if (data.description !== undefined) {
    updateFields.push("description = ?");
    updateValues.push(data.description);
  }

  if (data.is_private !== undefined) {
    updateFields.push("is_private = ?");
    updateValues.push(data.is_private);
  }

  if (updateFields.length === 0) {
    return group;
  }

  updateValues.push(id_group);

  await db.query(
    `UPDATE \`group\` SET ${updateFields.join(", ")} WHERE id_group = ?`,
    updateValues
  );

  return getGroupById(id_group);
};

