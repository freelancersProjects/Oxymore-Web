import { Router } from "express";
import {
  getAllTournamentMaps,
  createTournamentMap,
  deleteTournamentMap,
} from "../controllers/tournamentMapController";

const router = Router();

/**
 * @openapi
 * /api/tournament-maps:
 *   get:
 *     tags:
 *       - TournamentMaps
 *     summary: Récupère tous les liens tournoi-map
 *     responses:
 *       200:
 *         description: Liste des liens
 */
router.get("/", getAllTournamentMaps);

/**
 * @openapi
 * /api/tournament-maps:
 *   post:
 *     tags:
 *       - TournamentMaps
 *     summary: Ajoute un lien tournoi-map
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/TournamentMapInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TournamentMapInput'
 *     responses:
 *       201:
 *         description: Lien ajouté
 */
router.post("/", createTournamentMap);

/**
 * @openapi
 * /api/tournament-maps/{id}:
 *   delete:
 *     tags:
 *       - TournamentMaps
 *     summary: Supprime un lien tournoi-map
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
router.delete("/:id", deleteTournamentMap);

export default router;
