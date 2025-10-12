export interface TeamChat {
  id_team_chat: string;
  message: string;
  sent_at?: string;
  id_team: string;
  id_user: string;
}

export interface TeamChatInput {
  message: string;
  sent_at?: string;
  id_team: string;
  id_user: string;
}

export interface TeamChatUpdate {
  message?: string;
  sent_at?: string;
  id_team?: string;
  id_user?: string;
}

export interface TeamChatStats {
  total_messages: number;
  messages_today: number;
  active_chats: number;
  average_messages_per_team: number;
}
