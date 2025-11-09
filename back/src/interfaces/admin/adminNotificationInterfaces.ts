export type AdminNotificationType = 'message' | 'success' | 'alert';

export interface AdminNotification {
  id_admin_notification: string;
  type: AdminNotificationType;
  title: string;
  text: string;
  created_at: string;
  read_at?: string;
}

export interface AdminNotificationInput {
  type: AdminNotificationType;
  title: string;
  text: string;
}

export interface AdminNotificationUpdate {
  type?: AdminNotificationType;
  title?: string;
  text?: string;
}

export interface AdminNotificationWithReadStatus extends AdminNotification {
  is_read: boolean;
}

