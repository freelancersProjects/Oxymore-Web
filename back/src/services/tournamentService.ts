import { Tournament } from "../models/tournamentModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllTournaments = async (): Promise<Tournament[]> => {
  const [rows] = await db.query("SELECT * FROM tournament");
  return rows as Tournament[];
};

export const createTournament = async (data: Omit<Tournament, "id_tournament">): Promise<Tournament> => {
  const id_tournament = crypto.randomUUID();
  await db.query(
    `INSERT INTO tournament (
      id_tournament, tournament_name, organized_by, description, type, format, structure, start_date, end_date, check_in_date, cash_prize, entry_fee, max_participant, min_participant, is_premium, image_url, id_league, id_badge_winner
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_tournament,
      data.tournament_name,
      data.organized_by ?? null,
      data.description ?? null,
      data.type,
      data.format,
      data.structure,
      data.start_date,
      data.end_date,
      data.check_in_date ?? null,
      data.cash_prize ?? null,
      data.entry_fee ?? null,
      data.max_participant ?? null,
      data.min_participant ?? null,
      data.is_premium ?? false,
      data.image_url ?? null,
      data.id_league,
      data.id_badge_winner ?? null
    ]
  );
  return { id_tournament, ...data };
};

export const deleteTournament = async (id_tournament: string): Promise<void> => {
  await db.query("DELETE FROM tournament WHERE id_tournament = ?", [id_tournament]);
};
