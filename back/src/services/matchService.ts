import { Match } from "../models/matchModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllMatches = async (): Promise<Match[]> => {
  const [rows] = await db.query("SELECT * FROM match");
  return rows as Match[];
};

export const createMatch = async (data: Omit<Match, "id_match">): Promise<Match> => {
  const id_match = crypto.randomUUID();
  await db.query(
    "INSERT INTO match (id_match, score_team1, score_team2, match_date, status, is_streamed, id_tournament, id_team1, id_team2, id_winner_team) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id_match,
      data.score_team1,
      data.score_team2,
      data.match_date,
      data.status,
      data.is_streamed ?? false,
      data.id_tournament,
      data.id_team1,
      data.id_team2,
      data.id_winner_team ?? null
    ]
  );
  return { id_match, ...data };
};

export const deleteMatch = async (id_match: string): Promise<void> => {
  await db.query("DELETE FROM match WHERE id_match = ?", [id_match]);
};
