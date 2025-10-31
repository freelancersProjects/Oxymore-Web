import { Notification, NotificationWithReadStatus } from "../../models/notification/notificationModel";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllNotifications = async (): Promise<Notification[]> => {
  const [rows] = await db.query("SELECT * FROM notification ORDER BY created_at DESC");
  return rows as Notification[];
};

export const getNotificationsByUserId = async (userId: string): Promise<NotificationWithReadStatus[]> => {
  const [rows] = await db.query(`
    SELECT
      n.*,
      CASE WHEN nr.id_notification_read IS NOT NULL THEN 1 ELSE 0 END as is_read,
      nr.read_at
    FROM notification n
    LEFT JOIN notification_read nr ON n.id_notification = nr.id_notification AND nr.id_user = ?
    ORDER BY n.created_at DESC
  `, [userId]);

  return (rows as any[]).map((row: any) => ({
    id_notification: row.id_notification,
    type: row.type,
    title: row.title,
    text: row.text,
    created_at: row.created_at,
    id_user: row.id_user,
    is_read: Boolean(row.is_read),
    read_at: row.read_at || undefined,
  }));
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  const [rows] = await db.query(`
    SELECT COUNT(*) as count
    FROM notification n
    LEFT JOIN notification_read nr ON n.id_notification = nr.id_notification AND nr.id_user = ?
    WHERE nr.id_notification_read IS NULL
  `, [userId]);

  return (rows as any)[0].count;
};

export const createNotification = async (
  data: Omit<Notification, "id_notification" | "created_at">
): Promise<Notification> => {
  const id_notification = crypto.randomUUID();
  const created_at = new Date().toISOString();

  await db.query(
    "INSERT INTO notification (id_notification, type, title, text, created_at, id_user) VALUES (?, ?, ?, ?, ?, ?)",
    [id_notification, data.type, data.title, data.text, created_at, data.id_user || null]
  );

  return { id_notification, created_at, ...data };
};

export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  const id_notification_read = crypto.randomUUID();
  await db.query(
    "INSERT IGNORE INTO notification_read (id_notification_read, id_user, id_notification, read_at) VALUES (?, ?, ?, ?)",
    [id_notification_read, userId, notificationId, new Date().toISOString()]
  );
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  await db.query(`
    INSERT IGNORE INTO notification_read (id_user, id_notification)
    SELECT ?, id_notification FROM notification
    WHERE id_notification NOT IN (
      SELECT id_notification FROM notification_read WHERE id_user = ?
    )
  `, [userId, userId]);
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await db.query("DELETE FROM notification WHERE id_notification = ?", [notificationId]);
};

export const deleteNotificationForUser = async (userId: string, notificationId: string): Promise<void> => {
  await db.query(
    "DELETE FROM notification_read WHERE id_user = ? AND id_notification = ?",
    [userId, notificationId]
  );
};

