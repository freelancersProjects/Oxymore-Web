import { Router } from "express";
import {
  getAllPinnedMessageTeams,
  createPinnedMessageTeam,
  deletePinnedMessageTeam,
  getPinnedMessagesByTeamId,
} from "../../controllers/pinnedMessage/pinnedMessageTeamController";

const router = Router();

/**
 * @openapi
 * /api/pinned-message-teams:
 *   get:
 *     tags:
 *       - PinnedMessageTeams
 *     summary: Récupère tous les messages épinglés d'équipe
 *     responses:
 *       200:
 *         description: Liste des messages épinglés
 */
router.get("/", getAllPinnedMessageTeams);

/**
 * @openapi
 * /api/pinned-message-teams:
 *   post:
 *     tags:
 *       - PinnedMessageTeams
 *     summary: Épingle un message d'équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/PinnedMessageTeamInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PinnedMessageTeamInput'
 *     responses:
 *       201:
 *         description: Message épinglé
 */
router.post("/", createPinnedMessageTeam);

router.get("/team/:id_team", getPinnedMessagesByTeamId);

/**
 * @openapi
 * /api/pinned-message-teams/{id}:
 *   delete:
 *     tags:
 *       - PinnedMessageTeams
 *     summary: Supprime un message épinglé d'équipe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Message épinglé supprimé
 */
router.delete("/:id", deletePinnedMessageTeam);

export default router;
