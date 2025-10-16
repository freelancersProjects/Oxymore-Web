import { RowDataPacket } from 'mysql2';

export interface ChannelBot extends RowDataPacket {
  id_channel: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface ChannelBotData {
  id_channel: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface ChannelBotInput {
  name: string;
  user_id: string;
}
