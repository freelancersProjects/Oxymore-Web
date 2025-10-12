export type NotificationType = 'message' | 'success' | 'alert';

export interface Notification {
  id_notification: number;
  type: NotificationType;
  title: string;
  text: string;
  created_at: string;
}

export interface NotificationRead {
  id_notification_read: number;
  id_user: string;
  id_notification: number;
  read_at: string;
}

export interface NotificationInput {
  type: NotificationType;
  title: string;
  text: string;
}

export interface NotificationUpdate {
  type?: NotificationType;
  title?: string;
  text?: string;
}

export interface NotificationWithReadStatus extends Notification {
  is_read: boolean;
  read_at?: string;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  notifications_today: number;
  notifications_by_type: Record<NotificationType, number>;
}
