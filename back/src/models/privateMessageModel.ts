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

export interface PrivateMessage {
  id_private_message: string;
  content: string;
  sent_at?: string;
  receiver_id: string;
  sender_id: string;
  is_read: boolean;
}

export interface PrivateMessageInput {
  content: string;
  receiver_id: string;
  sender_id: string;
  is_read?: boolean;
}




