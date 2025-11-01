/**
 * @openapi
 * components:
 *   schemas:
 *     NotificationAdminInput:
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
 *     NotificationAdmin:
 *       type: object
 *       properties:
 *         id_notification_admin:
 *           type: string
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
 *         read_at:
 *           type: string
 *           format: date-time
 */

import { NotificationAdmin, NotificationAdminWithReadStatus } from '../../interfaces/admin/notificationAdminInterfaces';

export { NotificationAdmin, NotificationAdminWithReadStatus };

