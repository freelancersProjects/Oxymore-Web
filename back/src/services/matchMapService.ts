import { MatchMap } from "../models/matchMapModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllMatchMaps = async (): Promise<MatchMap[]> => {
  const [rows] = await db.query("SELECT * FROM match_map");
  return rows as MatchMap[];
};

export const createMatchMap = async (data: Omit<MatchMap, "id_match_map">): Promise<MatchMap> => {
  const id_match_map = crypto.randomUUID();
  await db.query(
    "INSERT INTO match_map (id_match_map, map_order, id_match, id_map, picked_by, winner_team) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_match_map,
      data.map_order ?? null,
      data.id_match,
      data.id_map,
      data.picked_by ?? null,
      data.winner_team ?? null
    ]
  );
  return { id_match_map, ...data };
};

export const deleteMatchMap = async (id_match_map: string): Promise<void> => {
  await db.query("DELETE FROM match_map WHERE id_match_map = ?", [id_match_map]);
};
