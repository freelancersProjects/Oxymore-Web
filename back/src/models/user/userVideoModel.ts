/**
 * @openapi
 * components:
 *   schemas:
 *     UserVideoInput:
 *       type: object
 *       required:
 *         - video_url
 *         - id_user
 *       properties:
 *         video_url:
 *           type: string
 *         description:
 *           type: string
 *         posted_at:
 *           type: string
 *           format: date-time
 *         likes_count:
 *           type: integer
 *         shares_count:
 *           type: integer
 *         comments_count:
 *           type: integer
 *         is_downloadable:
 *           type: boolean
 *         id_user:
 *           type: string
 */

import { UserVideo } from '../../interfaces/content/videoInterfaces';

export { UserVideo };
