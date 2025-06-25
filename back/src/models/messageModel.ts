/**
 * @openapi
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id_message:
 *           type: string
 *         channel_id:
 *           type: string
 *         user_id:
 *           type: string
 *           nullable: true
 *         content:
 *           type: string
 *         is_from_ai:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 */
export interface Message {
  id_message: string;
  channel_id: string;
  user_id?: string | null; // Peut être null si message IA
  content: string;
  is_from_ai: boolean;
  created_at: string;
}

export const messages: Message[] = []; 