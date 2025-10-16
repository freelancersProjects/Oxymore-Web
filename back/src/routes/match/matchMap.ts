import { Router } from "express";
import {
  getAllMatchMaps,
  createMatchMap,
  deleteMatchMap,
} from "../../controllers/match/matchMapController";

const router = Router();

/**
 * @openapi
 * /api/match-maps:
 *   get:
 *     tags:
 *       - MatchMaps
 *     summary: Récupère tous les match maps
 *     responses:
 *       200:
 *         description: Liste des match maps
 */
router.get("/", getAllMatchMaps);

/**
 * @openapi
 * /api/match-maps:
 *   post:
 *     tags:
 *       - MatchMaps
 *     summary: Crée un match map
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/MatchMapInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MatchMapInput'
 *     responses:
 *       201:
 *         description: Match map créé
 */
router.post("/", createMatchMap);

/**
 * @openapi
 * /api/match-maps/{id}:
 *   delete:
 *     tags:
 *       - MatchMaps
 *     summary: Supprime un match map
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Match map supprimé
 */
router.delete("/:id", deleteMatchMap);

export default router;
