import { Group } from "../models/groupModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllGroups = async (): Promise<Group[]> => {
  const [rows] = await db.query("SELECT * FROM `group`");
  return rows as Group[];
};

export const createGroup = async (data: Omit<Group, "id_group">): Promise<Group> => {
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
  return { id_group, ...data };
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

export const createDefaultGroupForUser = async (userId: string): Promise<Group> => {
  const id_group = crypto.randomUUID();
  await db.query(
    "INSERT INTO `group` (id_group, group_name, description, is_private, created_at, id_owner) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_group,
      'Mon Groupe',
      'Groupe par défaut',
      false,
      new Date().toISOString(),
      userId
    ]
  );

  // Ajouter l'utilisateur comme owner du groupe
  const id_group_member = crypto.randomUUID();
  await db.query(
    "INSERT INTO group_member (id_group_member, join_date, role, status, id_group, id_user) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_group_member,
      new Date().toISOString(),
      'owner',
      'accepted',
      id_group,
      userId
    ]
  );

  return {
    id_group,
    group_name: 'Mon Groupe',
    description: 'Groupe par défaut',
    is_private: false,
    created_at: new Date().toISOString(),
    id_owner: userId
  };
};
