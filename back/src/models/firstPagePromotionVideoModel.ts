/**
 * @openapi
 * components:
 *   schemas:
 *     FirstPagePromotionVideoInput:
 *       type: object
 *       required:
 *         - video_url
 *         - title
 *         - by_user
 *       properties:
 *         video_url:
 *           type: string
 *         title:
 *           type: string
 *         by_user:
 *           type: string
 */

export interface FirstPagePromotionVideo {
  first_page_promotion_video: string;
  video_url: string;
  title: string;
  by_user: string;
}
