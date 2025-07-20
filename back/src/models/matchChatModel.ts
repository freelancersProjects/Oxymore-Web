/**
 * @openapi
 * components:
 *   schemas:
 *     MatchChatInput:
 *       type: object
 *       required:
 *         - message
 *         - id_match
 *         - id_user
 *       properties:
 *         message:
 *           type: string
 *         sent_at:
 *           type: string
 *           format: date-time
 *         id_match:
 *           type: string
 *         id_user:
 *           type: string
 */

export interface MatchChat {
  id_match_chat: string;
  message: string;
  sent_at?: string;
  id_match: string;
  id_user: string;
}
