import { Router } from "express";
import {
  getAllMatches,
  createMatch,
  deleteMatch,
} from "../../controllers/match/matchController";

const router = Router();

/**
 * @openapi
 * /api/matches:
 *   get:
 *     tags:
 *       - Matches
 *     summary: Récupère tous les matchs
 *     responses:
 *       200:
 *         description: Liste des matchs
 */
router.get("/", getAllMatches);

/**
 * @openapi
 * /api/matches:
 *   post:
 *     tags:
 *       - Matches
 *     summary: Crée un match
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/MatchInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MatchInput'
 *     responses:
 *       201:
 *         description: Match créé
 */
router.post("/", createMatch);

/**
 * @openapi
 * /api/matches/{id}:
 *   delete:
 *     tags:
 *       - Matches
 *     summary: Supprime un match
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Match supprimé
 */
router.delete("/:id", deleteMatch);

export default router;
