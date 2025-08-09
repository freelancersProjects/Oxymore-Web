export interface NotificationRead {
  id_notification_read: string;
  id_notification: string;
  id_user: string;
  read_at?: string;
}

export interface NotificationReadInput {
  id_notification: string;
  id_user: string;
  read_at?: string;
}

export interface NotificationReadUpdate {
  id_notification?: string;
  id_user?: string;
  read_at?: string;
}

export interface NotificationReadStats {
  total_read_notifications: number;
  read_notifications_today: number;
  average_read_time: number;
  read_rate_percentage: number;
}
