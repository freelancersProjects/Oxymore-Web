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

import { Badge } from '../../interfaces/badge/badgeInterfaces';

export { Badge };
