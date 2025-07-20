import { Map } from "../models/mapModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllMaps = async (): Promise<Map[]> => {
  const [rows] = await db.query("SELECT * FROM map");
  return rows as Map[];
};

export const createMap = async (data: Omit<Map, "id_map">): Promise<Map> => {
  const id_map = crypto.randomUUID();
  await db.query(
    "INSERT INTO map (id_map, map_name, map_code, image_url) VALUES (?, ?, ?, ?)",
    [
      id_map,
      data.map_name,
      data.map_code,
      data.image_url ?? null
    ]
  );
  return { id_map, ...data };
};

export const deleteMap = async (id_map: string): Promise<void> => {
  await db.query("DELETE FROM map WHERE id_map = ?", [id_map]);
};
