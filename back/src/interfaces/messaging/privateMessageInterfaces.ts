import { RowDataPacket } from 'mysql2';

export interface PrivateMessage extends RowDataPacket {
  id_private_message: string;
  content: string;
  sent_at?: string;
  receiver_id: string;
  sender_id: string;
  is_read: boolean;
  reply_to?: string;
  reply_username?: string;
  reply_content?: string;
  reply_sender_id?: string;
}

export interface PrivateMessageInput {
  content: string;
  receiver_id: string;
  sender_id: string;
  is_read?: boolean;
  reply_to?: string;
}

export interface PrivateMessageUpdate {
  content?: string;
  is_read?: boolean;
}


