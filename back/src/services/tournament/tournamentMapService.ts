import { TournamentMap } from "../../models/tournament/tournamentMapModel";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllTournamentMaps = async (): Promise<TournamentMap[]> => {
  const [rows] = await db.query("SELECT * FROM tournament_map");
  return rows as TournamentMap[];
};

export const createTournamentMap = async (data: Omit<TournamentMap, "id_tournament_map">): Promise<TournamentMap> => {
  const id_tournament_map = crypto.randomUUID();
  await db.query(
    "INSERT INTO tournament_map (id_tournament_map, id_tournament, id_map) VALUES (?, ?, ?)",
    [
      id_tournament_map,
      data.id_tournament,
      data.id_map
    ]
  );
  return { id_tournament_map, ...data };
};

export const getTournamentMapsByTournamentId = async (id_tournament: string): Promise<any[]> => {
  const [rows] = await db.query(`
    SELECT m.* FROM map m
    INNER JOIN tournament_map tm ON m.id_map = tm.id_map
    WHERE tm.id_tournament = ?
  `, [id_tournament]);
  return rows as any[];
};

export const deleteTournamentMap = async (id_tournament_map: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM tournament_map WHERE id_tournament_map = ?", [id_tournament_map]);
  return (result as any).affectedRows > 0;
};

export const deleteTournamentMapsByTournamentId = async (id_tournament: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM tournament_map WHERE id_tournament = ?", [id_tournament]);
  return (result as any).affectedRows > 0;
};

