export interface PrivateMessageWebSocket {
  id_message: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  username?: string;
  avatar_url?: string;
  reply_to?: string;
  reply_content?: string;
  reply_username?: string;
  reply_sender_id?: string;
}

export interface PrivateMessage {
  id_private_message: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  sent_at: string;
  is_read: boolean;
  reply_to?: string;
  reply_content?: string;
  reply_username?: string;
  reply_sender_id?: string;
  sender_username?: string;
  receiver_username?: string;
  sender_avatar_url?: string;
  receiver_avatar_url?: string;
}

export interface Conversation {
  other_user_id: string;
  other_username: string;
  other_display_name?: string;
  other_avatar_url?: string;
  other_online_status?: string;
  last_message?: PrivateMessage;
  unread_count: number;
}

export interface UsePrivateMessageSocketOptions {
  friendId: string | null;
  onMessage?: (message: PrivateMessageWebSocket) => void;
  onMessageEdited?: (message: PrivateMessageWebSocket) => void;
  onMessageDeleted?: (data: { message_id: string; sender_id: string; receiver_id: string }) => void;
  onTyping?: (data: { user_id: string; username?: string; is_typing: boolean }) => void;
  onError?: (error: string) => void;
}



