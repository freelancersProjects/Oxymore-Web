export type NotificationAdminType = 'message' | 'success' | 'alert';

export interface NotificationAdmin {
  id_notification_admin: string;
  type: NotificationAdminType;
  title: string;
  text: string;
  created_at: string;
  read_at?: string;
}

export interface NotificationAdminInput {
  type: NotificationAdminType;
  title: string;
  text: string;
}

export interface NotificationAdminUpdate {
  type?: NotificationAdminType;
  title?: string;
  text?: string;
}

export interface NotificationAdminWithReadStatus extends NotificationAdmin {
  is_read: boolean;
}

