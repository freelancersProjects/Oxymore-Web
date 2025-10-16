import { GroupMember, GroupMemberData, GroupMemberInput } from "../../interfaces/group/groupInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllGroupMembers = async (): Promise<GroupMember[]> => {
  const [rows] = await db.query("SELECT * FROM group_member");
  return rows as GroupMember[];
};

export const getGroupMembersByGroupId = async (groupId: string): Promise<GroupMember[]> => {
  const [rows] = await db.query(`
    SELECT gm.*, u.username, u.avatar_url
    FROM group_member gm
    LEFT JOIN user u ON gm.id_user = u.id_user
    WHERE gm.id_group = ?
  `, [groupId]);
  return rows as GroupMember[];
};

export const getPendingInvitationsByUserId = async (userId: string): Promise<GroupMember[]> => {
  const [rows] = await db.query(`
    SELECT gm.*, g.group_name, g.description, u.username, u.avatar_url
    FROM group_member gm
    JOIN \`group\` g ON gm.id_group = g.id_group
    JOIN user u ON g.id_owner = u.id_user
    WHERE gm.id_user = ? AND gm.status = 'pending'
  `, [userId]);
  return rows as GroupMember[];
};

export const createGroupMember = async (data: GroupMemberInput): Promise<GroupMemberData> => {
  const id_group_member = crypto.randomUUID();

  try {
    // Essayer d'abord avec la colonne status
    await db.query(
      "INSERT INTO group_member (id_group_member, join_date, role, status, id_group, id_user) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id_group_member,
        data.join_date ?? new Date().toISOString(),
        data.role,
        data.status ?? 'pending',
        data.id_group,
        data.id_user
      ]
    );
  } catch (error) {
    // Si la colonne status n'existe pas, utiliser l'ancienne structure
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
  }

  return { id_group_member, ...data, status: data.status ?? 'pending' };
};

export const updateGroupMemberStatus = async (id_group_member: string, status: 'accepted' | 'rejected'): Promise<GroupMember | null> => {
  const [result] = await db.query(
    "UPDATE group_member SET status = ? WHERE id_group_member = ?",
    [status, id_group_member]
  );

  if ((result as any).affectedRows > 0) {
    const [rows] = await db.query("SELECT * FROM group_member WHERE id_group_member = ?", [id_group_member]);
    return (rows as GroupMember[])[0] || null;
  }
  return null;
};

export const deleteGroupMember = async (id_group_member: string): Promise<void> => {
  await db.query("DELETE FROM group_member WHERE id_group_member = ?", [id_group_member]);
};

export const inviteFriendToGroup = async (groupId: string, userId: string, role: 'member' | 'admin' = 'member'): Promise<GroupMemberData> => {
  // Vérifier si l'invitation existe déjà
  const [existing] = await db.query(
    "SELECT * FROM group_member WHERE id_group = ? AND id_user = ?",
    [groupId, userId]
  );

  if ((existing as any[]).length > 0) {
    throw new Error('User already invited to this group');
  }

  return createGroupMember({
    id_group: groupId,
    id_user: userId,
    role,
    status: 'pending'
  });
};

