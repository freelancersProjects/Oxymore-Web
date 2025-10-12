import { Router, RequestHandler } from "express";
import {
  getAllBadges,
  getBadgeById,
  createBadge,
  updateBadge,
  deleteBadge,
} from "../../controllers/badge/badgeController";

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
router.get("/", getAllBadges as RequestHandler);

/**
 * @openapi
 * /api/badges/{id}:
 *   get:
 *     tags:
 *       - Badges
 *     summary: Récupère un badge par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Badge trouvé
 *       404:
 *         description: Badge non trouvé
 */
router.get("/:id", getBadgeById as RequestHandler);

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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BadgeInput'
 *     responses:
 *       201:
 *         description: Badge créé
 */
router.post("/", createBadge as RequestHandler);

/**
 * @openapi
 * /api/badges/{id}:
 *   patch:
 *     tags:
 *       - Badges
 *     summary: Met à jour un badge
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
 *             $ref: '#/components/schemas/BadgeInput'
 *     responses:
 *       200:
 *         description: Badge mis à jour
 *       404:
 *         description: Badge non trouvé
 */
router.patch("/:id", updateBadge as RequestHandler);

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
router.delete("/:id", deleteBadge as RequestHandler);

export default router;
