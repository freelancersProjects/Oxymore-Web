import { TournamentMap } from "../models/tournamentMapModel";
import { db } from "../config/db";
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

export const deleteTournamentMap = async (id_tournament_map: string): Promise<void> => {
  await db.query("DELETE FROM tournament_map WHERE id_tournament_map = ?", [id_tournament_map]);
};
