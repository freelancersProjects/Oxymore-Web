import { TeamMember, TeamMemberData } from "../../interfaces/team/teamInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllTeamMembers = async (): Promise<TeamMember[]> => {
  const [rows] = await db.query("SELECT * FROM team_member");
  return rows as TeamMember[];
};

export const createTeamMember = async (data: Omit<TeamMemberData, "id_team_member">): Promise<TeamMemberData> => {
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

export const getUserTeamByUserId = async (id_user: string): Promise<TeamMember | null> => {
  const [rows] = await db.query(
    "SELECT * FROM team_member WHERE id_user = ?",
    [id_user]
  );
  const teamMembers = rows as TeamMember[];
  return teamMembers.length > 0 ? teamMembers[0] : null;
};

export const getTeamMembersByTeamId = async (id_team: string): Promise<any[]> => {
  const [rows] = await db.query(
    `SELECT
      tm.id_team_member,
      tm.role,
      tm.included_in_team_premium,
      tm.join_date,
      tm.id_team,
      tm.id_user,
      u.username,
      u.avatar_url
    FROM team_member tm
    LEFT JOIN user u ON tm.id_user = u.id_user
    WHERE tm.id_team = ?`,
    [id_team]
  );
  return rows as any[];
};

export const updateTeamMemberRole = async (id_team_member: string, role: string): Promise<void> => {
  await db.query(
    "UPDATE team_member SET role = ? WHERE id_team_member = ?",
    [role, id_team_member]
  );
};

