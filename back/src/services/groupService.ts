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
