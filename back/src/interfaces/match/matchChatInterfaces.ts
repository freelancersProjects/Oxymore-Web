export interface MatchChat {
  id_match_chat: string;
  message: string;
  sent_at?: string;
  id_match: string;
  id_user: string;
}

export interface MatchChatInput {
  message: string;
  sent_at?: string;
  id_match: string;
  id_user: string;
}

export interface MatchChatUpdate {
  message?: string;
  sent_at?: string;
  id_match?: string;
  id_user?: string;
}

export interface MatchChatStats {
  total_messages: number;
  messages_today: number;
  active_match_chats: number;
  average_messages_per_match: number;
}
