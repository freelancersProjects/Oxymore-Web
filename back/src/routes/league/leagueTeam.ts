import { Router } from "express";
import {
  getAllLeagueTeams,
  getLeagueTeamById,
  getLeagueTeamsByLeagueId,
  getLeagueTeamsByTeamId,
  getLeagueTeamByLeagueAndTeam,
  createLeagueTeam,
  updateLeagueTeam,
  deleteLeagueTeam,
  deleteLeagueTeamByLeagueAndTeam,
  updateLeaguePositions,
  getLeagueStats,
} from "../../controllers/league/leagueTeamController";

const router = Router();

/**
 * @openapi
 * /api/league-teams:
 *   get:
 *     tags:
 *       - League Teams
 *     summary: Récupère toutes les équipes de ligues
 *     responses:
 *       200:
 *         description: Liste des équipes de ligues
 */
router.get("/", getAllLeagueTeams);

/**
 * @openapi
 * /api/league-teams/{id}:
 *   get:
 *     tags:
 *       - League Teams
 *     summary: Récupère une équipe de ligue par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Équipe de ligue trouvée
 *       404:
 *         description: Équipe de ligue non trouvée
 */
router.get("/:id", getLeagueTeamById);

/**
 * @openapi
 * /api/league-teams/league/{leagueId}:
 *   get:
 *     tags:
 *       - League Teams
 *     summary: Récupère toutes les équipes d'une ligue (classement)
 *     parameters:
 *       - in: path
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Classement de la ligue
 */
router.get("/league/:leagueId", getLeagueTeamsByLeagueId);

/**
 * @openapi
 * /api/league-teams/team/{teamId}:
 *   get:
 *     tags:
 *       - League Teams
 *     summary: Récupère toutes les ligues d'une équipe
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des ligues de l'équipe
 */
router.get("/team/:teamId", getLeagueTeamsByTeamId);

/**
 * @openapi
 * /api/league-teams/league/{leagueId}/team/{teamId}:
 *   get:
 *     tags:
 *       - League Teams
 *     summary: Récupère une équipe spécifique dans une ligue
 *     parameters:
 *       - in: path
 *         name: leagueId
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
router.get("/league/:leagueId/team/:teamId", getLeagueTeamByLeagueAndTeam);

/**
 * @openapi
 * /api/league-teams:
 *   post:
 *     tags:
 *       - League Teams
 *     summary: Crée une inscription d'équipe à une ligue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeagueTeamInput'
 *     responses:
 *       201:
 *         description: Inscription créée
 *       400:
 *         description: Données invalides
 */
router.post("/", createLeagueTeam);

/**
 * @openapi
 * /api/league-teams/{id}:
 *   put:
 *     tags:
 *       - League Teams
 *     summary: Met à jour une équipe de ligue
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
 *             $ref: '#/components/schemas/LeagueTeamInput'
 *     responses:
 *       200:
 *         description: Équipe mise à jour
 */
router.put("/:id", updateLeagueTeam);

/**
 * @openapi
 * /api/league-teams/{id}:
 *   delete:
 *     tags:
 *       - League Teams
 *     summary: Supprime une équipe de ligue
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
router.delete("/:id", deleteLeagueTeam);

/**
 * @openapi
 * /api/league-teams/league/{leagueId}/team/{teamId}:
 *   delete:
 *     tags:
 *       - League Teams
 *     summary: Supprime une équipe d'une ligue spécifique
 *     parameters:
 *       - in: path
 *         name: leagueId
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
 *         description: Équipe supprimée de la ligue
 */
router.delete("/league/:leagueId/team/:teamId", deleteLeagueTeamByLeagueAndTeam);

/**
 * @openapi
 * /api/league-teams/league/{leagueId}/update-positions:
 *   post:
 *     tags:
 *       - League Teams
 *     summary: Met à jour les positions dans une ligue
 *     parameters:
 *       - in: path
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Positions mises à jour
 */
router.post("/league/:leagueId/update-positions", updateLeaguePositions);

/**
 * @openapi
 * /api/league-teams/league/{leagueId}/stats:
 *   get:
 *     tags:
 *       - League Teams
 *     summary: Récupère les statistiques d'une ligue
 *     parameters:
 *       - in: path
 *         name: leagueId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistiques de la ligue
 */
router.get("/league/:leagueId/stats", getLeagueStats);

export default router;
