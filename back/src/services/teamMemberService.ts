import { TeamMember } from "../models/teamMemberModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllTeamMembers = async (): Promise<TeamMember[]> => {
  const [rows] = await db.query("SELECT * FROM team_member");
  return rows as TeamMember[];
};

export const createTeamMember = async (data: Omit<TeamMember, "id_team_member">): Promise<TeamMember> => {
  const id_team_member = crypto.randomUUID();
  await db.query(
    "INSERT INTO team_member (id_team_member, role, included_in_team_premium, join_date, id_team, id_user) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_team_member,
      data.role,
      data.included_in_team_premium ?? false,
      data.join_date ?? new Date().toISOString(),
      data.id_team,
      data.id_user
    ]
  );
  return { id_team_member, ...data };
};

export const deleteTeamMember = async (id_team_member: string): Promise<void> => {
  await db.query("DELETE FROM team_member WHERE id_team_member = ?", [id_team_member]);
};
