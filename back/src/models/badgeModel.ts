/**
 * @openapi
 * components:
 *   schemas:
 *     BadgeInput:
 *       type: object
 *       required:
 *         - badge_name
 *       properties:
 *         badge_name:
 *           type: string
 *         badge_description:
 *           type: string
 *         image_url:
 *           type: string
 *         unlock_condition:
 *           type: string
 */

export interface Badge {
  id_badge: string;
  badge_name: string;
  badge_description?: string;
  image_url?: string;
  unlock_condition?: string;
}
