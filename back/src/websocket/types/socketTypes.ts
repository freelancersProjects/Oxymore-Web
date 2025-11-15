import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export interface ChatMessagePayload {
  content: string;
  channel_id?: string;
  recipient_id?: string; // Pour les messages privés
  user_id: string;
  is_from_ai?: boolean;
}

export interface ChatMessageResponse {
  id_message: string;
  content: string;
  created_at: string;
  user_id: string | null;
  channel_id?: string;
  recipient_id?: string;
  is_from_ai: boolean;
  username?: string;
  avatar_url?: string;
}

export interface TypingPayload {
  channel_id?: string;
  recipient_id?: string;
  is_typing: boolean;
}

export interface JoinChannelPayload {
  channel_id: string;
}

export interface LeaveChannelPayload {
  channel_id: string;
}

export interface MessageReadPayload {
  message_id: number;
  channel_id?: string;
  recipient_id?: string;
}

export interface SocketUser {
  userId: string;
  socketId: string;
  username?: string;
  rooms: Set<string>;
}

