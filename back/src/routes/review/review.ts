import { Router } from 'express';
import type { Handler } from 'express';
import {
  getAllReviews,
  getReviewById,
  getReviewsByUser,
  getReviewsByTournament,
  getGlobalReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} from '../../controllers/review/reviewController';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/reviews/stats:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Récupère les statistiques des reviews
 *     responses:
 *       200:
 *         description: Statistiques des reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewStats'
 */
router.get('/stats', getReviewStats as Handler);

/**
 * @openapi
 * /api/reviews/user/{id_user}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Récupère toutes les reviews d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des reviews de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/user/:id_user', getReviewsByUser as Handler);

/**
 * @openapi
 * /api/reviews/global:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Récupère toutes les reviews globales (id_tournament = NULL)
 *     responses:
 *       200:
 *         description: Liste des reviews globales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/global', getGlobalReviews as Handler);

/**
 * @openapi
 * /api/reviews/tournament/{id_tournament}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Récupère toutes les reviews d'un tournoi spécifique
 *     parameters:
 *       - in: path
 *         name: id_tournament
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des reviews du tournoi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/tournament/:id_tournament', getReviewsByTournament as Handler);

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Récupère toutes les reviews
 *     responses:
 *       200:
 *         description: Liste de toutes les reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/', getAllReviews as Handler);

/**
 * @openapi
 * /api/reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Récupère une review par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review non trouvée
 */
router.get('/:id', getReviewById as Handler);

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Crée une nouvelle review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *               id_team:
 *                 type: string
 *                 nullable: true
 *               id_tournament:
 *                 type: string
 *                 nullable: true
 *                 description: NULL pour avis global, rempli pour avis spécifique tournoi
 *     responses:
 *       201:
 *         description: Review créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticateToken, createReview as Handler);

/**
 * @openapi
 * /api/reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Met à jour une review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review non trouvée
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticateToken, updateReview as Handler);

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Supprime une review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review supprimée avec succès
 *       404:
 *         description: Review non trouvée
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticateToken, deleteReview as Handler);

export default router;

