import { Router } from "express";
import {
  createApplication,
  getApplicationsByTeam,
  getApplicationsByUser,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '../../controllers/team/teamApplicationController';

const router = Router();

/**
 * @openapi
 * /api/team-applications:
 *   post:
 *     tags:
 *       - TeamApplications
 *     summary: Crée une candidature d'équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_team
 *               - id_user
 *             properties:
 *               id_team:
 *                 type: string
 *               id_user:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidature créée
 */
router.post('/', createApplication);

/**
 * @openapi
 * /api/team-applications/team/{teamId}:
 *   get:
 *     tags:
 *       - TeamApplications
 *     summary: Récupère toutes les candidatures d'une équipe
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des candidatures
 */
router.get('/team/:teamId', getApplicationsByTeam);

/**
 * @openapi
 * /api/team-applications/user/{userId}:
 *   get:
 *     tags:
 *       - TeamApplications
 *     summary: Récupère toutes les candidatures d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des candidatures de l'utilisateur
 */
router.get('/user/:userId', getApplicationsByUser);

/**
 * @openapi
 * /api/team-applications/{id}:
 *   get:
 *     tags:
 *       - TeamApplications
 *     summary: Récupère une candidature par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidature trouvée
 *       404:
 *         description: Candidature non trouvée
 */
router.get('/:id', getApplicationById);

/**
 * @openapi
 * /api/team-applications/{id}/status:
 *   patch:
 *     tags:
 *       - TeamApplications
 *     summary: Met à jour le statut d'une candidature
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
 *                 enum: [pending, accepted, rejected]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 */
router.patch('/:id/status', updateApplicationStatus);

/**
 * @openapi
 * /api/team-applications/{id}:
 *   delete:
 *     tags:
 *       - TeamApplications
 *     summary: Supprime une candidature
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidature supprimée
 */
router.delete('/:id', deleteApplication);

export default router;
