import { Router } from "express";
import {
  getAllTournaments,
  createTournament,
  deleteTournament,
} from "../controllers/tournamentController";

const router = Router();

/**
 * @openapi
 * /api/tournaments:
 *   get:
 *     tags:
 *       - Tournaments
 *     summary: Récupère tous les tournois
 *     responses:
 *       200:
 *         description: Liste des tournois
 */
router.get("/", getAllTournaments);

/**
 * @openapi
 * /api/tournaments:
 *   post:
 *     tags:
 *       - Tournaments
 *     summary: Crée un tournoi
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/TournamentInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TournamentInput'
 *     responses:
 *       201:
 *         description: Tournoi créé
 */
router.post("/", createTournament);

/**
 * @openapi
 * /api/tournaments/{id}:
 *   delete:
 *     tags:
 *       - Tournaments
 *     summary: Supprime un tournoi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tournoi supprimé
 */
router.delete("/:id", deleteTournament);

export default router;
