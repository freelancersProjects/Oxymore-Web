/**
 * @openapi
 * components:
 *   schemas:
 *     ChannelBotInput:
 *       type: object
 *       required:
 *         - name
 *         - user_id
 *       properties:
 *         name:
 *           type: string
 *         user_id:
 *           type: string
 */

import { ChannelBot } from '../../interfaces/messaging/messagingInterfaces';

export { ChannelBot };
