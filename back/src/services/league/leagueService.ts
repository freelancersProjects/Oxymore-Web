import { League, LeagueData, LeagueUpdate } from "../../interfaces/league/leagueInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllLeagues = async (): Promise<League[]> => {
  const [rows] = await db.query("SELECT * FROM league");
  return rows as League[];
};

export const createLeague = async (data: { league_name: string; max_teams?: number; start_date?: string; end_date?: string; promotion_slots?: number; relegation_slots?: number; image_url?: string; entry_type?: string; id_badge_champion?: string }): Promise<LeagueData> => {
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
  return {
    id_league,
    league_name: data.league_name,
    max_teams: data.max_teams,
    start_date: data.start_date,
    end_date: data.end_date,
    promotion_slots: data.promotion_slots,
    relegation_slots: data.relegation_slots,
    image_url: data.image_url,
    entry_type: data.entry_type,
    id_badge_champion: data.id_badge_champion
  };
};

export const getLeagueById = async (id_league: string): Promise<League | null> => {
  const [rows] = await db.query("SELECT * FROM league WHERE id_league = ?", [id_league]);
  const leagues = rows as League[];
  return leagues.length > 0 ? leagues[0] : null;
};

export const updateLeague = async (id_league: string, data: LeagueUpdate): Promise<League | null> => {
  const league = await getLeagueById(id_league);
  if (!league) return null;

  await db.query(
    "UPDATE league SET league_name = ?, max_teams = ?, start_date = ?, end_date = ?, promotion_slots = ?, relegation_slots = ?, image_url = ?, entry_type = ?, id_badge_champion = ? WHERE id_league = ?",
    [
      data.league_name ?? league.league_name,
      data.max_teams ?? league.max_teams,
      data.start_date ?? league.start_date,
      data.end_date ?? league.end_date,
      data.promotion_slots ?? league.promotion_slots,
      data.relegation_slots ?? league.relegation_slots,
      data.image_url ?? league.image_url,
      data.entry_type ?? league.entry_type,
      data.id_badge_champion ?? league.id_badge_champion,
      id_league
    ]
  );

  return await getLeagueById(id_league);
};

export const deleteLeague = async (id_league: string): Promise<void> => {
  await db.query("DELETE FROM league WHERE id_league = ?", [id_league]);
};

