/**
 * @openapi
 * components:
 *   schemas:
 *     VideoLikeInput:
 *       type: object
 *       required:
 *         - id_user
 *         - id_video
 *       properties:
 *         liked_at:
 *           type: string
 *           format: date-time
 *         id_user:
 *           type: string
 *         id_video:
 *           type: string
 */

import { VideoLike } from '../../interfaces/content/videoInterfaces';

export { VideoLike };
