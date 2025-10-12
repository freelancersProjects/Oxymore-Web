/**
 * @openapi
 * components:
 *   schemas:
 *     PrivateMessageInput:
 *       type: object
 *       required:
 *         - content
 *         - receiver_id
 *         - sender_id
 *       properties:
 *         content:
 *           type: string
 *         sent_at:
 *           type: string
 *           format: date-time
 *         receiver_id:
 *           type: string
 *         sender_id:
 *           type: string
 *         is_read:
 *           type: boolean
 */

import { PrivateMessage } from '../../interfaces/messaging/privateMessageInterfaces';

export { PrivateMessage };
