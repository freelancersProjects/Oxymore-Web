import { Router } from "express";
import {
  getAllLeagues,
  createLeague,
  deleteLeague,
} from "../controllers/leagueController";

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
