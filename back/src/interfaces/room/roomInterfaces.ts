import { RowDataPacket } from 'mysql2';

export interface Room extends RowDataPacket {
  id_room: string;
  room_code: string;
  map_picker_url?: string;
  is_pick_phase_active?: boolean;
  admin_joinable?: boolean;
  id_match: string;
}

export interface RoomInput {
  room_code: string;
  map_picker_url?: string;
  is_pick_phase_active?: boolean;
  admin_joinable?: boolean;
  id_match: string;
}

export interface RoomData {
  id_room: string;
  room_code: string;
  map_picker_url?: string;
  is_pick_phase_active?: boolean;
  admin_joinable?: boolean;
  id_match: string;
}
