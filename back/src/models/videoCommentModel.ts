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

export interface VideoComment {
  id_video_comment: string;
  comment_text: string;
  posted_at?: string;
  id_user: string;
  id_video: string;
}
