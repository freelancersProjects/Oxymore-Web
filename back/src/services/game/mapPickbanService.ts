import { MapPickban } from "../../models/game/mapPickbanModel";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllMapPickbans = async (): Promise<MapPickban[]> => {
  const [rows] = await db.query("SELECT * FROM map_pickban");
  return rows as MapPickban[];
};

export const createMapPickban = async (data: Omit<MapPickban, "id_map_pickban">): Promise<MapPickban> => {
  const id_map_pickban = crypto.randomUUID();
  await db.query(
    "INSERT INTO map_pickban (id_map_pickban, action, `order`, id_match, id_team, id_map) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_map_pickban,
      data.action,
      data.order,
      data.id_match,
      data.id_team,
      data.id_map
    ]
  );
  return { id_map_pickban, ...data };
};

export const deleteMapPickban = async (id_map_pickban: string): Promise<void> => {
  await db.query("DELETE FROM map_pickban WHERE id_map_pickban = ?", [id_map_pickban]);
};

