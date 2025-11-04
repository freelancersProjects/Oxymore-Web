/**
 * @openapi
 * components:
 *   schemas:
 *     ReviewInput:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         id_user:
 *           type: string
 *           description: Automatiquement récupéré du token JWT, pas besoin de l'envoyer
 *         id_team:
 *           type: string
 *           nullable: true
 *         id_tournament:
 *           type: string
 *           nullable: true
 *           description: NULL pour avis global sur la plateforme, rempli pour avis spécifique sur un tournoi
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *           nullable: true
 *     Review:
 *       type: object
 *       properties:
 *         id_review:
 *           type: string
 *         id_user:
 *           type: string
 *         id_team:
 *           type: string
 *           nullable: true
 *         id_tournament:
 *           type: string
 *           nullable: true
 *           description: NULL = avis global, rempli = avis spécifique tournoi
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     ReviewStats:
 *       type: object
 *       properties:
 *         total_reviews:
 *           type: integer
 *         average_rating:
 *           type: number
 *         reviews_by_rating:
 *           type: object
 *           additionalProperties:
 *             type: integer
 */

import { Review } from '../../interfaces/review/reviewInterfaces';

export { Review };

