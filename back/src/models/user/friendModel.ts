/**
 * @openapi
 * components:
 *   schemas:
 *     FriendInput:
 *       type: object
 *       required:
 *         - id_user_sender
 *         - id_user_receiver
 *       properties:
 *         id_user_sender:
 *           type: string
 *         id_user_receiver:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, blocked]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

import { Friend, FriendWithUser } from '../../interfaces/user/friendInterfaces';

export { Friend, FriendWithUser };
