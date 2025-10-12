import { Router } from "express";
import {
  getAllTournamentTeams,
  getTournamentTeamById,
  getTournamentTeamsByTournamentId,
  getTournamentTeamsByTeamId,
  getTournamentTeamByTournamentAndTeam,
  createTournamentTeam,
  updateTournamentTeam,
  deleteTournamentTeam,
  deleteTournamentTeamByTournamentAndTeam,
  getTournamentStats,
} from "../../controllers/tournament/tournamentTeamController";

const router = Router();

/**
 * @openapi
 * /api/tournament-teams:
 *   get:
 *     tags:
 *       - Tournament Teams
 *     summary: Récupère toutes les équipes de tournois
 *     responses:
 *       200:
 *         description: Liste des équipes de tournois
 */
router.get("/", getAllTournamentTeams);

/**
 * @openapi
 * /api/tournament-teams/{id}:
 *   get:
 *     tags:
 *       - Tournament Teams
 *     summary: Récupère une équipe de tournoi par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Équipe de tournoi trouvée
 *       404:
 *         description: Équipe de tournoi non trouvée
 */
router.get("/:id", getTournamentTeamById);

/**
 * @openapi
 * /api/tournament-teams/tournament/{tournamentId}:
 *   get:
 *     tags:
 *       - Tournament Teams
 *     summary: Récupère toutes les équipes d'un tournoi
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des équipes du tournoi
 */
router.get("/tournament/:tournamentId", getTournamentTeamsByTournamentId);

/**
 * @openapi
 * /api/tournament-teams/team/{teamId}:
 *   get:
 *     tags:
 *       - Tournament Teams
 *     summary: Récupère tous les tournois d'une équipe
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des tournois de l'équipe
 */
router.get("/team/:teamId", getTournamentTeamsByTeamId);

/**
 * @openapi
 * /api/tournament-teams/tournament/{tournamentId}/team/{teamId}:
 *   get:
 *     tags:
 *       - Tournament Teams
 *     summary: Récupère une équipe spécifique dans un tournoi
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Équipe trouvée
 *       404:
 *         description: Équipe non trouvée
 */
router.get("/tournament/:tournamentId/team/:teamId", getTournamentTeamByTournamentAndTeam);

/**
 * @openapi
 * /api/tournament-teams:
 *   post:
 *     tags:
 *       - Tournament Teams
 *     summary: Crée une inscription d'équipe à un tournoi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TournamentTeamInput'
 *     responses:
 *       201:
 *         description: Inscription créée
 *       400:
 *         description: Données invalides
 */
router.post("/", createTournamentTeam);

/**
 * @openapi
 * /api/tournament-teams/{id}:
 *   put:
 *     tags:
 *       - Tournament Teams
 *     summary: Met à jour une équipe de tournoi
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
 *             $ref: '#/components/schemas/TournamentTeamInput'
 *     responses:
 *       200:
 *         description: Équipe mise à jour
 */
router.put("/:id", updateTournamentTeam);

/**
 * @openapi
 * /api/tournament-teams/{id}:
 *   delete:
 *     tags:
 *       - Tournament Teams
 *     summary: Supprime une équipe de tournoi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Équipe supprimée
 */
router.delete("/:id", deleteTournamentTeam);

/**
 * @openapi
 * /api/tournament-teams/tournament/{tournamentId}/team/{teamId}:
 *   delete:
 *     tags:
 *       - Tournament Teams
 *     summary: Supprime une équipe d'un tournoi spécifique
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Équipe supprimée du tournoi
 */
router.delete("/tournament/:tournamentId/team/:teamId", deleteTournamentTeamByTournamentAndTeam);

/**
 * @openapi
 * /api/tournament-teams/tournament/{tournamentId}/stats:
 *   get:
 *     tags:
 *       - Tournament Teams
 *     summary: Récupère les statistiques d'un tournoi
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistiques du tournoi
 */
router.get("/tournament/:tournamentId/stats", getTournamentStats);

export default router;
