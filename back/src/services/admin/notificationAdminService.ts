import { NotificationAdmin, NotificationAdminInput, NotificationAdminWithReadStatus } from "../../interfaces/admin/notificationAdminInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";

export const getAllNotificationAdmins = async (): Promise<NotificationAdminWithReadStatus[]> => {
  const [rows] = await db.query(`
    SELECT
      *,
      CASE WHEN read_at IS NOT NULL THEN 1 ELSE 0 END as is_read
    FROM notification_admin
    ORDER BY created_at DESC
  `);

  return (rows as any[]).map((row: any) => ({
    id_notification_admin: row.id_notification_admin,
    type: row.type,
    title: row.title,
    text: row.text,
    created_at: row.created_at,
    read_at: row.read_at || undefined,
    is_read: Boolean(row.is_read),
  }));
};

export const getUnreadNotificationAdminsCount = async (): Promise<number> => {
  const [rows] = await db.query(`
    SELECT COUNT(*) as count
    FROM notification_admin
    WHERE read_at IS NULL
  `);

  return (rows as any)[0].count;
};

export const createNotificationAdmin = async (
  data: NotificationAdminInput
): Promise<NotificationAdmin> => {
  const id_notification_admin = crypto.randomUUID();
  const created_at = new Date().toISOString();

  await db.query(
    "INSERT INTO notification_admin (id_notification_admin, type, title, text, created_at) VALUES (?, ?, ?, ?, ?)",
    [id_notification_admin, data.type, data.title, data.text, created_at]
  );

  return { 
    id_notification_admin, 
    created_at, 
    ...data 
  };
};

export const markNotificationAdminAsRead = async (notificationId: string): Promise<void> => {
  await db.query(
    "UPDATE notification_admin SET read_at = ? WHERE id_notification_admin = ?",
    [new Date().toISOString(), notificationId]
  );
};

export const markAllNotificationAdminsAsRead = async (): Promise<void> => {
  await db.query(
    "UPDATE notification_admin SET read_at = ? WHERE read_at IS NULL",
    [new Date().toISOString()]
  );
};

export const deleteNotificationAdmin = async (notificationId: string): Promise<void> => {
  await db.query("DELETE FROM notification_admin WHERE id_notification_admin = ?", [notificationId]);
};

export const getNotificationAdminById = async (notificationId: string): Promise<NotificationAdmin | null> => {
  const [rows] = await db.query(
    "SELECT * FROM notification_admin WHERE id_notification_admin = ?",
    [notificationId]
  );

  if (Array.isArray(rows) && rows.length > 0) {
    const row = rows[0] as any;
    return {
      id_notification_admin: row.id_notification_admin,
      type: row.type,
      title: row.title,
      text: row.text,
      created_at: row.created_at,
      read_at: row.read_at || undefined,
    };
  }

  return null;
};

// Helper pour créer automatiquement des notifications admin
export const createAdminNotificationForAction = async (
  action: string,
  entityType: string,
  entityName: string,
  details?: string
): Promise<void> => {
  try {
    const actionMessages: Record<string, string> = {
      'create': 'créé',
      'update': 'modifié',
      'delete': 'supprimé',
      'ban': 'banni',
      'mute': 'muté',
    };

    const actionMessage = actionMessages[action] || action;
    const type = action === 'delete' || action === 'ban' ? 'alert' : action === 'create' ? 'success' : 'message';
    
    const title = `${entityType} ${actionMessage}`;
    const text = details || `${entityName} a été ${actionMessage}`;

    await createNotificationAdmin({
      type: type as 'message' | 'success' | 'alert',
      title,
      text,
    });
  } catch (error) {
    console.error('Error creating admin notification for action:', error);
    // Ne pas bloquer l'action principale si la notification échoue
  }
};

