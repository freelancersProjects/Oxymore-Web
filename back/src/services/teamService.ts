import { Team } from "../models/teamModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllTeams = async (): Promise<Team[]> => {
  const [rows] = await db.query("SELECT * FROM team");
  return rows as Team[];
};

export const createTeam = async (
  data: Omit<Team, "id_team">
): Promise<Team> => {
  const id_team = crypto.randomUUID();
  await db.query(
    "INSERT INTO team (id_team, team_name, team_logo_url, team_banner_url, description, max_members, entry_type id_captain) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
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
