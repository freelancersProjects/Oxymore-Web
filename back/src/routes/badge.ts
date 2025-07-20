import { Router } from "express";
import {
  getAllBadges,
  createBadge,
  deleteBadge,
} from "../controllers/badgeController";

const router = Router();

/**
 * @openapi
 * /api/badges:
 *   get:
 *     tags:
 *       - Badges
 *     summary: Récupère tous les badges
 *     responses:
 *       200:
 *         description: Liste des badges
 */
router.get("/", getAllBadges);

/**
 * @openapi
 * /api/badges:
 *   post:
 *     tags:
 *       - Badges
 *     summary: Crée un badge
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/BadgeInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BadgeInput'
 *     responses:
 *       201:
 *         description: Badge créé
 */
router.post("/", createBadge);

/**
 * @openapi
 * /api/badges/{id}:
 *   delete:
 *     tags:
 *       - Badges
 *     summary: Supprime un badge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Badge supprimé
 */
router.delete("/:id", deleteBadge);

export default router;
