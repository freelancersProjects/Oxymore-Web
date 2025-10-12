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

import { FirstPagePromotionVideo } from '../../interfaces/content/contentInterfaces';

export { FirstPagePromotionVideo };
