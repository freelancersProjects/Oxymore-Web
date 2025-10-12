import { Game } from "../../models/game/gameModel";
import { db } from "../../config/db";

export const getAllGames = async (): Promise<Game[]> => {
  const [rows] = await db.query("SELECT * FROM games ORDER BY name ASC");
  return rows as Game[];
};

export const getGameById = async (id: string): Promise<Game | null> => {
  const [rows] = await db.query("SELECT * FROM games WHERE id = ?", [id]);
  const games = rows as Game[];
  return games.length > 0 ? games[0] : null;
};

