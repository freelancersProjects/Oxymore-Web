import { GroupMember } from "../models/groupMemberModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllGroupMembers = async (): Promise<GroupMember[]> => {
  const [rows] = await db.query("SELECT * FROM group_member");
  return rows as GroupMember[];
};

export const createGroupMember = async (data: Omit<GroupMember, "id_group_member">): Promise<GroupMember> => {
  const id_group_member = crypto.randomUUID();
  await db.query(
    "INSERT INTO group_member (id_group_member, join_date, role, id_group, id_user) VALUES (?, ?, ?, ?, ?)",
    [
      id_group_member,
      data.join_date ?? new Date().toISOString(),
      data.role,
      data.id_group,
      data.id_user
    ]
  );
  return { id_group_member, ...data };
};

export const deleteGroupMember = async (id_group_member: string): Promise<void> => {
  await db.query("DELETE FROM group_member WHERE id_group_member = ?", [id_group_member]);
};
