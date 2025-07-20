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

export interface VideoLike {
  id_video_like: string;
  liked_at?: string;
  id_user: string;
  id_video: string;
}
