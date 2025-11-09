import { Tournament, TournamentData } from "../../interfaces/tournament/tournamentInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllTournaments = async (): Promise<Tournament[]> => {
  const [rows] = await db.query("SELECT * FROM tournament");
  return rows as Tournament[];
};

export const getTournamentById = async (id_tournament: string): Promise<Tournament | null> => {
  const [rows] = await db.query("SELECT * FROM tournament WHERE id_tournament = ?", [id_tournament]);
  const tournaments = rows as Tournament[];
  return tournaments.length > 0 ? tournaments[0] : null;
};

export const createTournament = async (data: any): Promise<TournamentData> => {
  const id_tournament = crypto.randomUUID();
  await db.query(
    `INSERT INTO tournament (
      id_tournament, tournament_name, organized_by, description, type, format, structure, start_date, end_date, check_in_date, cash_prize, entry_fee, max_participant, min_participant, team_size, is_premium, image_url, id_league, id_badge_winner
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      data.cash_prize ?? 0,
      data.entry_fee ?? null,
      data.max_participant ?? null,
      data.min_participant ?? null,
      data.team_size ?? '5V5',
      data.is_premium ?? false,
      data.image_url ?? null,
      data.id_league,
      data.id_badge_winner ?? null
    ]
  );
  return {
    id_tournament,
    ...data
  };
};

export const updateTournament = async (id_tournament: string, data: Partial<Omit<Tournament, "id_tournament">>): Promise<Tournament | null> => {
  const [result] = await db.query(
    `UPDATE tournament SET
      tournament_name = ?, organized_by = ?, description = ?, type = ?, format = ?, structure = ?,
      start_date = ?, end_date = ?, check_in_date = ?, cash_prize = ?, entry_fee = ?,
      max_participant = ?, min_participant = ?, team_size = ?, is_premium = ?, image_url = ?, id_league = ?, id_badge_winner = ?
      WHERE id_tournament = ?`,
    [
      data.tournament_name,
      data.organized_by ?? null,
      data.description ?? null,
      data.type,
      data.format,
      data.structure,
      data.start_date,
      data.end_date,
      data.check_in_date ?? null,
      data.cash_prize ?? 0,
      data.entry_fee ?? null,
      data.max_participant ?? null,
      data.min_participant ?? null,
      data.team_size ?? '5V5',
      data.is_premium ?? false,
      data.image_url ?? null,
      data.id_league,
      data.id_badge_winner ?? null,
      id_tournament
    ]
  );

  if ((result as any).affectedRows === 0) {
    return null;
  }

  return getTournamentById(id_tournament);
};

export const deleteTournament = async (id_tournament: string): Promise<boolean> => {
  const [result] = await db.query("DELETE FROM tournament WHERE id_tournament = ?", [id_tournament]);
  return (result as any).affectedRows > 0;
};

export const getTournamentPageConfig = async () => {
  try {
    const [configRows] = await db.query(
      "SELECT * FROM tournament_page_config WHERE id_config = 'main-config' LIMIT 1"
    );
    const configs = configRows as any[];
    const config = configs.length > 0 ? configs[0] : { show_category_cards: true, featured_tournament_id: null };

    let featuredTournament = null;
    if (!config.show_category_cards && config.featured_tournament_id) {
      featuredTournament = await getTournamentById(config.featured_tournament_id);
    } else if (!config.show_category_cards) {
      const [latestRows] = await db.query(
        "SELECT * FROM tournament ORDER BY start_date DESC LIMIT 1"
      );
      const latest = latestRows as Tournament[];
      featuredTournament = latest.length > 0 ? latest[0] : null;
    }

    return {
      show_category_cards: config.show_category_cards,
      featured_tournament: featuredTournament
    };
  } catch (error: any) {
    console.error('Error fetching tournament page config:', error);
    return {
      show_category_cards: true,
      featured_tournament: null
    };
  }
};

