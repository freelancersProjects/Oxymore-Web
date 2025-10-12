import { TournamentTeam } from "../../models/tournament/tournamentTeamModel";
import { TournamentStats } from "../../interfaces/tournament/tournamentTeamInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllTournamentTeams = async (): Promise<TournamentTeam[]> => {
  const [rows] = await db.query("SELECT * FROM tournament_teams ORDER BY created_at DESC");
  return rows as TournamentTeam[];
};

export const getTournamentTeamById = async (id: string): Promise<TournamentTeam | null> => {
  const [rows] = await db.query("SELECT * FROM tournament_teams WHERE id = ?", [id]);
  const result = rows as TournamentTeam[];
  return result.length > 0 ? result[0] : null;
};

export const getTournamentTeamsByTournamentId = async (tournamentId: string): Promise<TournamentTeam[]> => {
  const [rows] = await db.query(
    "SELECT * FROM tournament_teams WHERE tournament_id = ? ORDER BY seed_position ASC, created_at ASC",
    [tournamentId]
  );
  return rows as TournamentTeam[];
};

export const getTournamentTeamsByTeamId = async (teamId: string): Promise<TournamentTeam[]> => {
  const [rows] = await db.query(
    "SELECT * FROM tournament_teams WHERE team_id = ? ORDER BY created_at DESC",
    [teamId]
  );
  return rows as TournamentTeam[];
};

export const getTournamentTeamByTournamentAndTeam = async (tournamentId: string, teamId: string): Promise<TournamentTeam | null> => {
  const [rows] = await db.query(
    "SELECT * FROM tournament_teams WHERE tournament_id = ? AND team_id = ?",
    [tournamentId, teamId]
  );
  const result = rows as TournamentTeam[];
  return result.length > 0 ? result[0] : null;
};

export const createTournamentTeam = async (data: Omit<TournamentTeam, "id" | "registration_date" | "created_at" | "updated_at">): Promise<TournamentTeam> => {
  const id = crypto.randomUUID();
  await db.query(
    `INSERT INTO tournament_teams (
      id, tournament_id, team_id, status, seed_position, final_position,
      matches_played, matches_won, matches_lost, matches_drawn, points_earned
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.tournament_id,
      data.team_id,
      data.status,
      data.seed_position ?? null,
      data.final_position ?? null,
      data.matches_played,
      data.matches_won,
      data.matches_lost,
      data.matches_drawn,
      data.points_earned
    ]
  );
  return { id, ...data, registration_date: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
};

export const updateTournamentTeam = async (id: string, data: Partial<Omit<TournamentTeam, "id" | "tournament_id" | "team_id" | "registration_date" | "created_at" | "updated_at">>): Promise<void> => {
  const updateFields = [];
  const updateValues = [];

  if (data.status !== undefined) {
    updateFields.push("status = ?");
    updateValues.push(data.status);
  }
  if (data.seed_position !== undefined) {
    updateFields.push("seed_position = ?");
    updateValues.push(data.seed_position);
  }
  if (data.final_position !== undefined) {
    updateFields.push("final_position = ?");
    updateValues.push(data.final_position);
  }
  if (data.matches_played !== undefined) {
    updateFields.push("matches_played = ?");
    updateValues.push(data.matches_played);
  }
  if (data.matches_won !== undefined) {
    updateFields.push("matches_won = ?");
    updateValues.push(data.matches_won);
  }
  if (data.matches_lost !== undefined) {
    updateFields.push("matches_lost = ?");
    updateValues.push(data.matches_lost);
  }
  if (data.matches_drawn !== undefined) {
    updateFields.push("matches_drawn = ?");
    updateValues.push(data.matches_drawn);
  }
  if (data.points_earned !== undefined) {
    updateFields.push("points_earned = ?");
    updateValues.push(data.points_earned);
  }

  updateFields.push("updated_at = CURRENT_TIMESTAMP");
  updateValues.push(id);

  await db.query(
    `UPDATE tournament_teams SET ${updateFields.join(", ")} WHERE id = ?`,
    updateValues
  );
};

export const deleteTournamentTeam = async (id: string): Promise<void> => {
  await db.query("DELETE FROM tournament_teams WHERE id = ?", [id]);
};

export const deleteTournamentTeamByTournamentAndTeam = async (tournamentId: string, teamId: string): Promise<void> => {
  await db.query("DELETE FROM tournament_teams WHERE tournament_id = ? AND team_id = ?", [tournamentId, teamId]);
};

export const getTournamentStats = async (tournamentId: string): Promise<TournamentStats> => {
  const [rows] = await db.query(
    `SELECT
      COUNT(*) as total_teams,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_teams,
      SUM(CASE WHEN status = 'registered' THEN 1 ELSE 0 END) as registered_teams,
      SUM(CASE WHEN status = 'disqualified' THEN 1 ELSE 0 END) as disqualified_teams,
      SUM(CASE WHEN status = 'withdrawn' THEN 1 ELSE 0 END) as withdrawn_teams
    FROM tournament_teams
    WHERE tournament_id = ?`,
    [tournamentId]
  );
  const result = rows as TournamentStats[];
  return result[0];
};

