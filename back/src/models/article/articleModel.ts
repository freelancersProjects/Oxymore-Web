/**
 * @openapi
 * components:
 *   schemas:
 *     ArticleInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         excerpt:
 *           type: string
 *         image_url:
 *           type: string
 *         id_category_article:
 *           type: string
 *         id_game:
 *           type: string
 *         id_author:
 *           type: string
 *         published:
 *           type: boolean
 *         published_at:
 *           type: string
 *           format: date-time
 */

import { Article } from '../../interfaces/article/articleInterfaces';

export { Article };

