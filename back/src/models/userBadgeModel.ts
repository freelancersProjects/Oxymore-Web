/**
 * @openapi
 * components:
 *   schemas:
 *     UserBadgeInput:
 *       type: object
 *       required:
 *         - id_user
 *         - id_badge
 *       properties:
 *         unlocked_date:
 *           type: string
 *           format: date-time
 *         id_user:
 *           type: string
 *         id_badge:
 *           type: string
 */

export interface UserBadge {
  id_user_badge: string;
  unlocked_date?: string;
  id_user: string;
  id_badge: string;
}
