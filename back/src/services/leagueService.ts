import { League } from "../models/leagueModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllLeagues = async (): Promise<League[]> => {
  const [rows] = await db.query("SELECT * FROM league");
  return rows as League[];
};

export const createLeague = async (data: Omit<League, "id_league">): Promise<League> => {
  const id_league = crypto.randomUUID();
  await db.query(
    "INSERT INTO league (id_league, league_name, max_teams, start_date, end_date, promotion_slots, relegation_slots, image_url, entry_type, id_badge_champion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id_league,
      data.league_name,
      data.max_teams ?? null,
      data.start_date ?? null,
      data.end_date ?? null,
      data.promotion_slots ?? null,
      data.relegation_slots ?? null,
      data.image_url ?? null,
      data.entry_type ?? null,
      data.id_badge_champion ?? null
    ]
  );
  return { id_league, ...data };
};

export const deleteLeague = async (id_league: string): Promise<void> => {
  await db.query("DELETE FROM league WHERE id_league = ?", [id_league]);
};
