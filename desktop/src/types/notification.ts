export type NotificationType = 'message' | 'success' | 'alert' | 'info';

export interface Notification {
  id_notification: string;
  type: NotificationType;
  title: string;
  text: string;
  created_at: string;
  id_user?: string | null;
}

export interface NotificationWithReadStatus extends Notification {
  is_read: boolean;
  read_at?: string;
}

export interface NotificationInput {
  type: NotificationType;
  title: string;
  text: string;
  id_user?: string | null;
}