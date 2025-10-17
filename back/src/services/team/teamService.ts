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

export const createTeam = async (
  data: Omit<TeamData, "id_team">
): Promise<TeamData> => {
  const id_team = crypto.randomUUID();
  await db.query(
    "INSERT INTO team (id_team, team_name, team_logo_url, team_banner_url, description, max_members, entry_type, id_captain, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
    [
      id_team,
      data.team_name,
      data.team_logo_url ?? null,
      data.team_banner_url ?? null,
      data.description ?? null,
      data.max_members ?? null,
      data.entry_type,
      data.id_captain,
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

