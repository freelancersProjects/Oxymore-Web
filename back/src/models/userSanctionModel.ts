/**
 * @openapi
 * components:
 *   schemas:
 *     UserSanctionInput:
 *       type: object
 *       required:
 *         - type
 *         - id_user
 *         - id_admin
 *       properties:
 *         reason:
 *           type: string
 *         type:
 *           type: string
 *           enum: [ban, mute, warning]
 *         created_at:
 *           type: string
 *           format: date-time
 *         expires_at:
 *           type: string
 *           format: date-time
 *         id_user:
 *           type: string
 *           format: uuid
 *         id_admin:
 *           type: string
 *           format: uuid
 */
export interface UserSanction {
  id_user_sanction: string;
  reason?: string;
  type: "ban" | "mute" | "warning"; // Enum
  created_at?: string; // ISO date string
  expires_at?: string; // ISO date string
  id_user: string;
  id_admin: string;
}
