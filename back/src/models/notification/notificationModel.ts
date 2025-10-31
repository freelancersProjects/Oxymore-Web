/**
 * @openapi
 * components:
 *   schemas:
 *     NotificationInput:
 *       type: object
 *       required:
 *         - type
 *         - title
 *         - text
 *       properties:
 *         type:
 *           type: string
 *           enum: [message, success, alert]
 *         title:
 *           type: string
 *         text:
 *           type: string
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
 *           type: string
 *         id_user:
 *           type: string
 *         id_notification:
 *           type: string
 *         read_at:
 *           type: string
 *           format: date-time
 */

import { Notification, NotificationRead, NotificationWithReadStatus } from '../../interfaces/notification/notificationInterfaces';

export { Notification, NotificationRead, NotificationWithReadStatus };
