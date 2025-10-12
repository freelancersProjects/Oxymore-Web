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

import { UserBadge } from '../../interfaces/user/userInterfaces';

export { UserBadge };
