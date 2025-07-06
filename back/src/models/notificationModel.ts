/**
 * @openapi
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id_notification:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [message, success, alert]
 *         title:
 *           type: string
 *         text:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     NotificationRead:
 *       type: object
 *       properties:
 *         id_notification_read:
 *           type: integer
 *         id_user:
 *           type: string
 *         id_notification:
 *           type: integer
 *         read_at:
 *           type: string
 *           format: date-time
 */

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

export interface NotificationWithReadStatus extends Notification {
  is_read: boolean;
  read_at?: string;
}

// Données de test
export const notifications: Notification[] = [
  {
    id_notification: 1,
    type: 'success',
    title: 'Tournament Created',
    text: 'Your tournament "CS2 Championship" has been successfully created!',
    created_at: new Date().toISOString(),
  },
  {
    id_notification: 2,
    type: 'message',
    title: 'New Message',
    text: 'You have received a new message from user "ProGamer123"',
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id_notification: 3,
    type: 'alert',
    title: 'Tournament Reminder',
    text: 'Your tournament starts in 30 minutes. Make sure to be ready!',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
];

export const notificationsRead: NotificationRead[] = [
  {
    id_notification_read: 1,
    id_user: "1",
    id_notification: 1,
    read_at: new Date().toISOString(),
  },
]; 