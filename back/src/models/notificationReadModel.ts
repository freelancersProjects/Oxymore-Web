/**
 * @openapi
 * components:
 *   schemas:
 *     NotificationReadInput:
 *       type: object
 *       required:
 *         - id_notification
 *         - id_user
 *       properties:
 *         id_notification:
 *           type: string
 *         id_user:
 *           type: string
 *         read_at:
 *           type: string
 *           format: date-time
 */

export interface NotificationRead {
  id_notification_read: string;
  id_notification: string;
  id_user: string;
  read_at?: string;
}
