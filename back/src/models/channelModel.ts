/**
 * @openapi
 * components:
 *   schemas:
 *     Channel:
 *       type: object
 *       properties:
 *         id_channel:
 *           type: string
 *         name:
 *           type: string
 *         user_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

export interface Channel {
  id_channel: string;
  name: string;
  user_id: string; // propriétaire du channel
  created_at: string;
}

export const channels: Channel[] = []; 