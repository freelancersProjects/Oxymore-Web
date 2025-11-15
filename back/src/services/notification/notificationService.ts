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
    LEFT JOIN notification_read nr ON n.id_notification = nr.id_notification AND nr.id_user COLLATE utf8mb4_general_ci = ?
    LEFT JOIN notification_hidden nh ON n.id_notification = nh.id_notification AND nh.id_user COLLATE utf8mb4_general_ci = ?
    LEFT JOIN user u ON u.id_user COLLATE utf8mb4_general_ci = ?
    WHERE (
      (n.id_user IS NULL AND n.created_at >= u.created_at) 
      OR n.id_user COLLATE utf8mb4_general_ci = ?
    )
    AND nh.id_notification_hidden IS NULL
    ORDER BY n.created_at DESC
  `, [userId, userId, userId, userId]);

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
    LEFT JOIN notification_read nr ON n.id_notification = nr.id_notification AND nr.id_user COLLATE utf8mb4_general_ci = ?
    LEFT JOIN notification_hidden nh ON n.id_notification = nh.id_notification AND nh.id_user COLLATE utf8mb4_general_ci = ?
    LEFT JOIN user u ON u.id_user COLLATE utf8mb4_general_ci = ?
    WHERE (
      (n.id_user IS NULL AND n.created_at >= u.created_at) 
      OR n.id_user COLLATE utf8mb4_general_ci = ?
    )
    AND nr.id_notification_read IS NULL
    AND nh.id_notification_hidden IS NULL
  `, [userId, userId, userId, userId]);

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
  const [userCheck] = await db.query(
    "SELECT id_user FROM user WHERE id_user = ?",
    [userId]
  );

  if (!Array.isArray(userCheck) || userCheck.length === 0) {
    console.error(`User ${userId} not found`);
    throw new Error(`User ${userId} does not exist`);
  }

  const [existing] = await db.query(
    "SELECT id_notification_read FROM notification_read WHERE id_user = ? AND id_notification = ?",
    [userId, notificationId]
  );

  if (Array.isArray(existing) && existing.length > 0) {
    const [updateResult] = await db.query(
      "UPDATE notification_read SET read_at = ? WHERE id_user = ? AND id_notification = ?",
      [new Date().toISOString(), userId, notificationId]
    );
  } else {
    const id_notification_read = crypto.randomUUID();
    const readAt = new Date().toISOString();
    const [insertResult] = await db.query(
      "INSERT INTO notification_read (id_notification_read, id_user, id_notification, read_at) VALUES (?, ?, ?, ?)",
      [id_notification_read, userId, notificationId, readAt]
    );
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const [userCheck] = await db.query(
    "SELECT id_user FROM user WHERE id_user = ?",
    [userId]
  );

  if (!Array.isArray(userCheck) || userCheck.length === 0) {
    return;
  }

  const [unreadNotifications] = await db.query(`
    SELECT n.id_notification FROM notification n
    LEFT JOIN notification_hidden nh ON n.id_notification = nh.id_notification AND nh.id_user COLLATE utf8mb4_general_ci = ?
    LEFT JOIN user u ON u.id_user COLLATE utf8mb4_general_ci = ?
    WHERE (
      (n.id_user IS NULL AND n.created_at >= u.created_at) 
      OR n.id_user COLLATE utf8mb4_general_ci = ?
    )
    AND nh.id_notification_hidden IS NULL
    AND n.id_notification NOT IN (
      SELECT id_notification FROM notification_read WHERE id_user COLLATE utf8mb4_general_ci = ?
    )
  `, [userId, userId, userId, userId]);

  if (Array.isArray(unreadNotifications) && unreadNotifications.length > 0) {
    const readAt = new Date().toISOString();
    for (const notif of unreadNotifications as any[]) {
      const id_notification_read = crypto.randomUUID();
      await db.query(
        "INSERT INTO notification_read (id_notification_read, id_user, id_notification, read_at) VALUES (?, ?, ?, ?)",
        [id_notification_read, userId, notif.id_notification, readAt]
      );
    }
  }
};

export const markReplyNotificationsAsReadForTeam = async (userId: string, teamName: string): Promise<void> => {
  const [userCheck] = await db.query(
    "SELECT id_user FROM user WHERE id_user = ?",
    [userId]
  );

  if (!Array.isArray(userCheck) || userCheck.length === 0) {
    return;
  }

  const [unreadReplyNotifications] = await db.query(`
    SELECT n.id_notification FROM notification n
    LEFT JOIN notification_read nr ON n.id_notification = nr.id_notification AND nr.id_user COLLATE utf8mb4_general_ci = ?
    LEFT JOIN notification_hidden nh ON n.id_notification = nh.id_notification AND nh.id_user COLLATE utf8mb4_general_ci = ?
    WHERE n.id_user COLLATE utf8mb4_general_ci = ?
    AND n.type = 'message'
    AND n.title = 'Nouvelle réponse'
    AND n.text LIKE ?
    AND nr.id_notification_read IS NULL
    AND nh.id_notification_hidden IS NULL
  `, [userId, userId, userId, `%dans ${teamName}%`]);

  if (Array.isArray(unreadReplyNotifications) && unreadReplyNotifications.length > 0) {
    const readAt = new Date().toISOString();
    for (const notif of unreadReplyNotifications as any[]) {
      const id_notification_read = crypto.randomUUID();
      await db.query(
        "INSERT INTO notification_read (id_notification_read, id_user, id_notification, read_at) VALUES (?, ?, ?, ?)",
        [id_notification_read, userId, notif.id_notification, readAt]
      );
    }
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await db.query("DELETE FROM notification_read WHERE id_notification = ?", [notificationId]);
  await db.query("DELETE FROM notification_hidden WHERE id_notification = ?", [notificationId]);
  await db.query("DELETE FROM notification WHERE id_notification = ?", [notificationId]);
};

export const deleteNotificationForUser = async (userId: string, notificationId: string): Promise<void> => {
  const [notificationCheck] = await db.query(
    "SELECT id_notification, id_user FROM notification WHERE id_notification = ?",
    [notificationId]
  );
  
  if (!Array.isArray(notificationCheck) || notificationCheck.length === 0) {
    return;
  }
  
  const notification = notificationCheck[0] as any;
  
  if (!notification.id_user) {
    const [existingHidden] = await db.query(
      "SELECT id_notification_hidden FROM notification_hidden WHERE id_user COLLATE utf8mb4_general_ci = ? AND id_notification = ?",
      [userId, notificationId]
    );
    
    if (!Array.isArray(existingHidden) || existingHidden.length === 0) {
      const id_notification_hidden = crypto.randomUUID();
      const hiddenAt = new Date().toISOString();
      await db.query(
        "INSERT INTO notification_hidden (id_notification_hidden, id_notification, id_user, hidden_at) VALUES (?, ?, ?, ?)",
        [id_notification_hidden, notificationId, userId, hiddenAt]
      );
    }
    
    await db.query(
      "DELETE FROM notification_read WHERE id_user = ? AND id_notification = ?",
      [userId, notificationId]
    );
  } else if (notification.id_user === userId) {
    await db.query("DELETE FROM notification_read WHERE id_notification = ?", [notificationId]);
    await db.query("DELETE FROM notification_hidden WHERE id_notification = ?", [notificationId]);
    await db.query("DELETE FROM notification WHERE id_notification = ?", [notificationId]);
  }
};

