/**
 * @openapi
 * components:
 *   schemas:
 *     MessageBot:
 *       type: object
 *       properties:
 *         id_message:
 *           type: string
 *         is_from_ai:
 *           type: boolean
 *         content:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         channel_id:
 *           type: string
 *         user_id:
 *           type: string
 *     MessageBotInput:
 *       type: object
 *       required:
 *         - is_from_ai
 *         - content
 *         - channel_id
 *         - user_id
 *       properties:
 *         is_from_ai:
 *           type: boolean
 *         content:
 *           type: string
 *         channel_id:
 *           type: string
 *         user_id:
 *           type: string
 */

export interface MessageBot {
  id_message: string;
  is_from_ai: boolean;
  content: string;
  created_at: string;
  channel_id: string;
  user_id: string;
}

export const messageBots: MessageBot[] = [];
