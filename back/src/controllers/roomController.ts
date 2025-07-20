import { Request, Response } from "express";
import * as RoomService from "../services/roomService";

export const getAllRooms = async (req: Request, res: Response) => {
  const rooms = await RoomService.getAllRooms();
  res.json(rooms);
};

export const createRoom = async (req: Request, res: Response) => {
  const { room_code, map_picker_url, is_pick_phase_active, admin_joinable, id_match } = req.body;
  if (!room_code || !id_match) {
    res.status(400).json({ message: "room_code et id_match sont requis" });
    return;
  }
  const newRoom = await RoomService.createRoom({
    room_code,
    map_picker_url,
    is_pick_phase_active,
    admin_joinable,
    id_match
  });
  res.status(201).json(newRoom);
};

export const deleteRoom = async (req: Request, res: Response) => {
  await RoomService.deleteRoom(req.params.id);
  res.status(204).send();
};
