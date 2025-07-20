import { NotificationRead } from "../models/notificationReadModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllNotificationReads = async (): Promise<NotificationRead[]> => {
  const [rows] = await db.query("SELECT * FROM notification_read");
  return rows as NotificationRead[];
};

export const createNotificationRead = async (data: Omit<NotificationRead, "id_notification_read">): Promise<NotificationRead> => {
  const id_notification_read = crypto.randomUUID();
  await db.query(
    "INSERT INTO notification_read (id_notification_read, id_notification, id_user, read_at) VALUES (?, ?, ?, ?)",
    [
      id_notification_read,
      data.id_notification,
      data.id_user,
      data.read_at ?? new Date().toISOString()
    ]
  );
  return { id_notification_read, ...data };
};

export const deleteNotificationRead = async (id_notification_read: string): Promise<void> => {
  await db.query("DELETE FROM notification_read WHERE id_notification_read = ?", [id_notification_read]);
};
