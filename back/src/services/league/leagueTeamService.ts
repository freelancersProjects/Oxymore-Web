import { LeagueTeam } from "../../models/league/leagueTeamModel";
import { LeagueStats } from "../../interfaces/league/leagueTeamInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllLeagueTeams = async (): Promise<LeagueTeam[]> => {
  const [rows] = await db.query("SELECT * FROM league_teams ORDER BY created_at DESC");
  return rows as LeagueTeam[];
};

export const getLeagueTeamById = async (id: string): Promise<LeagueTeam | null> => {
  const [rows] = await db.query("SELECT * FROM league_teams WHERE id = ?", [id]);
  const result = rows as LeagueTeam[];
  return result.length > 0 ? result[0] : null;
};

export const getLeagueTeamsByLeagueId = async (leagueId: string): Promise<LeagueTeam[]> => {
  const [rows] = await db.query(
    "SELECT * FROM league_teams WHERE league_id = ? ORDER BY points DESC, (goals_for - goals_against) DESC, goals_for DESC",
    [leagueId]
  );
  return rows as LeagueTeam[];
};

export const getLeagueTeamsByTeamId = async (teamId: string): Promise<LeagueTeam[]> => {
  const [rows] = await db.query(
    "SELECT * FROM league_teams WHERE team_id = ? ORDER BY created_at DESC",
    [teamId]
  );
  return rows as LeagueTeam[];
};

export const getLeagueTeamByLeagueAndTeam = async (leagueId: string, teamId: string): Promise<LeagueTeam | null> => {
  const [rows] = await db.query(
    "SELECT * FROM league_teams WHERE league_id = ? AND team_id = ?",
    [leagueId, teamId]
  );
  const result = rows as LeagueTeam[];
  return result.length > 0 ? result[0] : null;
};

export const createLeagueTeam = async (data: Omit<LeagueTeam, "id" | "registration_date" | "created_at" | "updated_at">): Promise<LeagueTeam> => {
  const id = crypto.randomUUID();
  await db.query(
    `INSERT INTO league_teams (
      id, league_id, team_id, status, matches_played, matches_won, matches_drawn, matches_lost,
      goals_for, goals_against, points, current_position
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.league_id,
      data.team_id,
      data.status,
      data.matches_played,
      data.matches_won,
      data.matches_drawn,
      data.matches_lost,
      data.goals_for,
      data.goals_against,
      data.points,
      data.current_position
    ]
  );
  return { id, ...data, registration_date: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
};

export const updateLeagueTeam = async (id: string, data: Partial<Omit<LeagueTeam, "id" | "league_id" | "team_id" | "registration_date" | "created_at" | "updated_at">>): Promise<void> => {
  const updateFields = [];
  const updateValues = [];

  if (data.status !== undefined) {
    updateFields.push("status = ?");
    updateValues.push(data.status);
  }
  if (data.matches_played !== undefined) {
    updateFields.push("matches_played = ?");
    updateValues.push(data.matches_played);
  }
  if (data.matches_won !== undefined) {
    updateFields.push("matches_won = ?");
    updateValues.push(data.matches_won);
  }
  if (data.matches_drawn !== undefined) {
    updateFields.push("matches_drawn = ?");
    updateValues.push(data.matches_drawn);
  }
  if (data.matches_lost !== undefined) {
    updateFields.push("matches_lost = ?");
    updateValues.push(data.matches_lost);
  }
  if (data.goals_for !== undefined) {
    updateFields.push("goals_for = ?");
    updateValues.push(data.goals_for);
  }
  if (data.goals_against !== undefined) {
    updateFields.push("goals_against = ?");
    updateValues.push(data.goals_against);
  }
  if (data.points !== undefined) {
    updateFields.push("points = ?");
    updateValues.push(data.points);
  }
  if (data.current_position !== undefined) {
    updateFields.push("current_position = ?");
    updateValues.push(data.current_position);
  }

  updateFields.push("updated_at = CURRENT_TIMESTAMP");
  updateValues.push(id);

  await db.query(
    `UPDATE league_teams SET ${updateFields.join(", ")} WHERE id = ?`,
    updateValues
  );
};

export const deleteLeagueTeam = async (id: string): Promise<void> => {
  await db.query("DELETE FROM league_teams WHERE id = ?", [id]);
};

export const deleteLeagueTeamByLeagueAndTeam = async (leagueId: string, teamId: string): Promise<void> => {
  await db.query("DELETE FROM league_teams WHERE league_id = ? AND team_id = ?", [leagueId, teamId]);
};

export const updateLeaguePositions = async (leagueId: string): Promise<void> => {
  await db.query(
    `UPDATE league_teams
     SET current_position = (
       SELECT position FROM (
         SELECT team_id,
                ROW_NUMBER() OVER (
                  ORDER BY points DESC,
                  (goals_for - goals_against) DESC,
                  goals_for DESC
                ) as position
         FROM league_teams
         WHERE league_id = ? AND status = 'active'
       ) ranked
       WHERE ranked.team_id = league_teams.team_id
     )
     WHERE league_id = ?`,
    [leagueId, leagueId]
  );
};

export const getLeagueStats = async (leagueId: string): Promise<LeagueStats> => {
  const [rows] = await db.query(
    `SELECT
      COUNT(*) as total_teams,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_teams,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_teams,
      SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_teams,
      SUM(matches_played) as total_matches,
      SUM(goals_for) as total_goals
    FROM league_teams
    WHERE league_id = ?`,
    [leagueId]
  );
  const result = rows as LeagueStats[];
  return result[0];
};

