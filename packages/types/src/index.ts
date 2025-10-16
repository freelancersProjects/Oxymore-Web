export interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
  side: "left" | "right";
  avatar: string;
  channel_id?: string;
  user_id?: string;
  is_from_ai?: boolean;
}

export type NotificationType = 'message' | 'success' | 'alert';

export interface Notification {
  id_notification: string;
  id_user: string;
  title: string;
  text: string;
  type: NotificationType;
  created_at: string;
  updated_at?: string;
}

export interface NotificationWithReadStatus extends Notification {
  is_read: boolean;
  read_at?: string;
}

export interface NotificationRead {
  id_notification_read: number;
  id_user: string;
  id_notification: string;
  read_at: string;
}
