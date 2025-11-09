import { Team, TeamData } from "../../interfaces/team/teamInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllTeams = async (): Promise<Team[]> => {
  const [rows] = await db.query(`
    SELECT
      t.*,
      u.username as captain_name,
      COUNT(tm.id_team_member) as members_count,
      ts.active as subscription_status,
      COALESCE(t.created_at, NOW()) as created_at
    FROM team t
    LEFT JOIN user u ON t.id_captain = u.id_user
    LEFT JOIN team_member tm ON t.id_team = tm.id_team
    LEFT JOIN team_subscription ts ON t.id_team = ts.id_team AND ts.active = 1
    GROUP BY t.id_team
    ORDER BY t.team_name
  `);
  return rows as Team[];
};

export const getTeamById = async (id: string): Promise<Team | null> => {
  const [rows] = await db.query(`
    SELECT
      t.*,
      u.username as captain_name,
      COUNT(tm.id_team_member) as members_count,
      ts.active as subscription_status,
      COALESCE(t.created_at, NOW()) as created_at
    FROM team t
    LEFT JOIN user u ON t.id_captain = u.id_user
    LEFT JOIN team_member tm ON t.id_team = tm.id_team
    LEFT JOIN team_subscription ts ON t.id_team = ts.id_team AND ts.active = 1
    WHERE t.id_team = ?
    GROUP BY t.id_team
  `, [id]);
  const teams = rows as Team[];
  return teams.length > 0 ? teams[0] : null;
};

export const createTeam = async (
  data: Omit<TeamData, "id_team">
): Promise<TeamData> => {
  const id_team = crypto.randomUUID();

  const [existingMember] = await db.query(
    "SELECT * FROM team_member WHERE id_user = ?",
    [String(data.id_captain)]
  );

  if (Array.isArray(existingMember) && existingMember.length > 0) {
    throw new Error("Vous êtes déjà membre d'une équipe. Vous ne pouvez être membre que d'une seule équipe à la fois.");
  }

  await db.query(
    "INSERT INTO team (id_team, team_name, team_logo_url, team_banner_url, description, max_members, entry_type, id_captain, created_at, verified, region, id_game) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)",
    [
      String(id_team),
      String(data.team_name),
      data.team_logo_url || null,
      data.team_banner_url || null,
      data.description || null,
      data.max_members || null,
      String(data.entry_type),
      String(data.id_captain),
      data.verified || false,
      data.region || null,
      data.id_game || null,
    ]
  );

  const id_team_member = crypto.randomUUID();
  console.log('Creating team member:', id_team_member, id_team, data.id_captain);

  await db.query(
    "INSERT INTO team_member (id_team_member, id_team, id_user, role, included_in_team_premium, join_date) VALUES (?, ?, ?, ?, ?, NOW())",
    [
      String(id_team_member),
      String(id_team),
      String(data.id_captain),
      'captain',
      false,
    ]
  );

  return { id_team, ...data };
};

export const updateTeam = async (
  id_team: string,
  data: Partial<Team>
): Promise<Team> => {
  const allowedFields = [
    "team_name",
    "team_logo_url",
    "team_banner_url",
    "description",
    "max_members",
    "entry_type",
    "region",
  ];
  const updateFields = Object.keys(data).filter((key) =>
    allowedFields.includes(key)
  );

  if (updateFields.length === 0) {
    throw new Error("No valid fields to update");
  }

  const setClause = updateFields.map((field) => `${field} = ?`).join(", ");
  const values = updateFields.map((field) => data[field as keyof Team]);

  await db.query(`UPDATE team SET ${setClause} WHERE id_team = ?`, [
    ...values,
    id_team,
  ]);

  const [rows] = await db.query("SELECT * FROM team WHERE id_team = ?", [
    id_team,
  ]);
  const updatedTeam = rows as Team[];

  if (updatedTeam.length === 0) {
    throw new Error("No Team found");
  }

  return updatedTeam[0];
};

export const deleteTeam = async (id_team: string): Promise<void> => {
  await db.query("DELETE FROM team WHERE id_team = ?", [id_team]);
};

