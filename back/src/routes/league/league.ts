import { Router } from "express";
import {
  getAllLeagues,
  createLeague,
  getLeagueById,
  updateLeague,
  deleteLeague,
  getLeagueTeams,
} from "../../controllers/league/leagueController";

const router = Router();

/**
 * @openapi
 * /api/leagues:
 *   get:
 *     tags:
 *       - Leagues
 *     summary: Récupère toutes les leagues
 *     responses:
 *       200:
 *         description: Liste des leagues
 */
router.get("/", getAllLeagues);

/**
 * @openapi
 * /api/leagues:
 *   post:
 *     tags:
 *       - Leagues
 *     summary: Crée une league
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/LeagueInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeagueInput'
 *     responses:
 *       201:
 *         description: League créée
 */
router.post("/", createLeague);

/**
 * @openapi
 * /api/leagues/{id}/teams:
 *   get:
 *     tags:
 *       - Leagues
 *     summary: Récupère les équipes d'une league
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des équipes de la league
 */
router.get("/:id/teams", getLeagueTeams);

/**
 * @openapi
 * /api/leagues/{id}:
 *   get:
 *     tags:
 *       - Leagues
 *     summary: Récupère une league par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: League trouvée
 *       404:
 *         description: League non trouvée
 */
router.get("/:id", getLeagueById);

/**
 * @openapi
 * /api/leagues/{id}:
 *   put:
 *     tags:
 *       - Leagues
 *     summary: Met à jour une league
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
 *             $ref: '#/components/schemas/LeagueInput'
 *     responses:
 *       200:
 *         description: League mise à jour
 *       404:
 *         description: League non trouvée
 */
router.put("/:id", updateLeague);

/**
 * @openapi
 * /api/leagues/{id}:
 *   delete:
 *     tags:
 *       - Leagues
 *     summary: Supprime une league
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: League supprimée
 */
router.delete("/:id", deleteLeague);

export default router;
