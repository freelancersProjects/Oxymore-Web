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

export interface ChannelBot {
  id_channel: string;
  name: string;
  user_id: string;
  created_at: string;
}

export const channelBots: ChannelBot[] = [];
