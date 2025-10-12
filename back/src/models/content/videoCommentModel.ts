/**
 * @openapi
 * components:
 *   schemas:
 *     VideoCommentInput:
 *       type: object
 *       required:
 *         - comment_text
 *         - id_user
 *         - id_video
 *       properties:
 *         comment_text:
 *           type: string
 *         posted_at:
 *           type: string
 *           format: date-time
 *         id_user:
 *           type: string
 *         id_video:
 *           type: string
 */

import { VideoComment } from '../../interfaces/content/videoInterfaces';

export { VideoComment };
