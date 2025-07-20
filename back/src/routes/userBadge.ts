import { Router } from "express";
import {
  getAllUserBadges,
  createUserBadge,
  deleteUserBadge,
} from "../controllers/userBadgeController";

const router = Router();

/**
 * @openapi
 * /api/user-badges:
 *   get:
 *     tags:
 *       - UserBadges
 *     summary: Récupère tous les liens user-badge
 *     responses:
 *       200:
 *         description: Liste des liens
 */
router.get("/", getAllUserBadges);

/**
 * @openapi
 * /api/user-badges:
 *   post:
 *     tags:
 *       - UserBadges
 *     summary: Ajoute un lien user-badge
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserBadgeInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserBadgeInput'
 *     responses:
 *       201:
 *         description: Lien ajouté
 */
router.post("/", createUserBadge);

/**
 * @openapi
 * /api/user-badges/{id}:
 *   delete:
 *     tags:
 *       - UserBadges
 *     summary: Supprime un lien user-badge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Lien supprimé
 */
router.delete("/:id", deleteUserBadge);

export default router;
