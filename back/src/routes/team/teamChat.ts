import { Router } from "express";
import {
  getAllTeamChats,
  createTeamChat,
  deleteTeamChat,
  getTeamChatsByTeamId,
  updateTeamChat,
  deleteTeamChatById,
} from "../../controllers/team/teamChatController";
import { createAdminTeamChat } from "../../controllers/team/adminTeamChatController";

const router = Router();

/**
 * @openapi
 * /api/team-chats:
 *   get:
 *     tags:
 *       - TeamChats
 *     summary: Récupère tous les messages de team
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get("/", getAllTeamChats);

/**
 * @openapi
 * /api/team-chats:
 *   post:
 *     tags:
 *       - TeamChats
 *     summary: Ajoute un message de team
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/TeamChatInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamChatInput'
 *     responses:
 *       201:
 *         description: Message ajouté
 */
router.post("/", createTeamChat);

router.get("/team/:id_team", getTeamChatsByTeamId);

/**
 * @openapi
 * /api/team-chats/admin:
 *   post:
 *     tags:
 *       - TeamChats
 *     summary: Ajoute un message admin dans le chat d'une équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - id_team
 *             properties:
 *               message:
 *                 type: string
 *               id_team:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message admin ajouté
 */
router.post("/admin", createAdminTeamChat);

router.patch("/:id", updateTeamChat);
router.delete("/:id", deleteTeamChatById);

/**
 * @openapi
 * /api/team-chats/{id}:
 *   delete:
 *     tags:
 *       - TeamChats
 *     summary: Supprime un message de team
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Message supprimé
 */
router.delete("/:id", deleteTeamChat);

export default router;
