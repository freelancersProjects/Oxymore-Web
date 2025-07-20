import { Router } from "express";
import {
  getAllTeamSubscriptions,
  createTeamSubscription,
  deleteTeamSubscription,
} from "../controllers/teamSubscriptionController";

const router = Router();

/**
 * @openapi
 * /api/team-subscriptions:
 *   get:
 *     tags:
 *       - TeamSubscriptions
 *     summary: Récupère tous les abonnements d'équipe
 *     responses:
 *       200:
 *         description: Liste des abonnements
 */
router.get("/", getAllTeamSubscriptions);

/**
 * @openapi
 * /api/team-subscriptions:
 *   post:
 *     tags:
 *       - TeamSubscriptions
 *     summary: Ajoute un abonnement d'équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/TeamSubscriptionInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamSubscriptionInput'
 *     responses:
 *       201:
 *         description: Abonnement ajouté
 */
router.post("/", createTeamSubscription);

/**
 * @openapi
 * /api/team-subscriptions/{id}:
 *   delete:
 *     tags:
 *       - TeamSubscriptions
 *     summary: Supprime un abonnement d'équipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Abonnement supprimé
 */
router.delete("/:id", deleteTeamSubscription);

export default router;
