export interface TeamChatReport {
  id_team_chat_report: string;
  id_team_chat: string;
  id_user: string;
  reason: string;
  created_at: string;
}

export interface TeamChatReportInput {
  id_team_chat: string;
  id_user: string;
  reason: string;
}

