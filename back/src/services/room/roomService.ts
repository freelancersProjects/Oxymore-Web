import { Room, RoomData } from "../../interfaces/room/roomInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllRooms = async (): Promise<Room[]> => {
  const [rows] = await db.query("SELECT * FROM room");
  return rows as Room[];
};

export const createRoom = async (data: any): Promise<RoomData> => {
  const id_room = crypto.randomUUID();
  await db.query(
    "INSERT INTO room (id_room, room_code, map_picker_url, is_pick_phase_active, admin_joinable, id_match) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_room,
      data.room_code,
      data.map_picker_url ?? null,
      data.is_pick_phase_active ?? false,
      data.admin_joinable ?? false,
      data.id_match
    ]
  );
  return {
    id_room,
    ...data
  };
};

export const deleteRoom = async (id_room: string): Promise<void> => {
  await db.query("DELETE FROM room WHERE id_room = ?", [id_room]);
};

