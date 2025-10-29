import { Router } from "express";
import {
  createChallenge,
  getChallengesByTeam,
  getChallengeById,
  updateChallengeStatus,
  updateChallengeScheduledDate,
  deleteChallenge
} from '../../controllers/team/teamChallengeController';

const router = Router();

/**
 * @openapi
 * /api/team-challenges:
 *   post:
 *     tags:
 *       - TeamChallenges
 *     summary: Crée un défi entre deux équipes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_team_challenger
 *               - id_team_challenged
 *             properties:
 *               id_team_challenger:
 *                 type: string
 *               id_team_challenged:
 *                 type: string
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Défi créé
 */
router.post('/', createChallenge);

/**
 * @openapi
 * /api/team-challenges/team/{teamId}:
 *   get:
 *     tags:
 *       - TeamChallenges
 *     summary: Récupère tous les défis d'une équipe
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des défis
 */
router.get('/team/:teamId', getChallengesByTeam);

/**
 * @openapi
 * /api/team-challenges/{id}:
 *   get:
 *     tags:
 *       - TeamChallenges
 *     summary: Récupère un défi par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Défi trouvé
 *       404:
 *         description: Défi non trouvé
 */
router.get('/:id', getChallengeById);

/**
 * @openapi
 * /api/team-challenges/{id}/status:
 *   patch:
 *     tags:
 *       - TeamChallenges
 *     summary: Met à jour le statut d'un défi
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, completed, cancelled]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 */
router.patch('/:id/status', updateChallengeStatus);

/**
 * @openapi
 * /api/team-challenges/{id}/scheduled-date:
 *   patch:
 *     tags:
 *       - TeamChallenges
 *     summary: Met à jour la date programmée d'un défi
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
 *               scheduled_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Date mise à jour avec succès
 */
router.patch('/:id/scheduled-date', updateChallengeScheduledDate);

/**
 * @openapi
 * /api/team-challenges/{id}:
 *   delete:
 *     tags:
 *       - TeamChallenges
 *     summary: Supprime un défi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Défi supprimé avec succès
 */
router.delete('/:id', deleteChallenge);

export default router;
