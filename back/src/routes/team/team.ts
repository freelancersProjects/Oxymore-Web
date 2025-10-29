import { Router } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../../controllers/team/teamController";

const router = Router();

/**
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Récupère toutes les teams
 *     responses:
 *       200:
 *         description: Liste des teams
 */
router.get("/", getAllTeams);

/**
 * @openapi
 * /api/teams/{id}:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Récupère une team par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team trouvée
 *       404:
 *         description: Team non trouvée
 */
router.get("/:id", getTeamById);

/**
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     summary: Crée une team
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
 *     responses:
 *       201:
 *         description: Team créée
 */
router.post("/", createTeam);

/**
 * @openapi
 * /api/teams/{id}:
 *   patch:
 *     tags:
 *       - Teams
 *     summary: Met à jour une team
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
 *             type: object
 *     responses:
 *       200:
 *         description: Team mise à jour
 */
router.patch("/:id", updateTeam);

/**
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     summary: Supprime une team
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Team supprimée
 */
router.delete("/:id", deleteTeam);

export default router;
