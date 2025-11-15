import { Router } from "express";
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentPageConfig,
} from "../../controllers/tournament/tournamentController";

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
 * /api/tournaments/config/page:
 *   get:
 *     tags:
 *       - Tournaments
 *     summary: Récupère la configuration de la page tournois
 *     responses:
 *       200:
 *         description: Configuration de la page tournois
 */
router.get("/config/page", getTournamentPageConfig);

/**
 * @openapi
 * /api/tournaments/{id}:
 *   get:
 *     tags:
 *       - Tournaments
 *     summary: Récupère un tournoi par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du tournoi
 *       404:
 *         description: Tournoi non trouvé
 */
router.get("/:id", getTournamentById);

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
 *   put:
 *     tags:
 *       - Tournaments
 *     summary: Met à jour un tournoi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       200:
 *         description: Tournoi mis à jour
 *       404:
 *         description: Tournoi non trouvé
 */
router.put("/:id", updateTournament);

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
 *       404:
 *         description: Tournoi non trouvé
 */
router.delete("/:id", deleteTournament);

export default router;
