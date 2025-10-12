import { Router } from "express";
import {
  getAllTeamChats,
  createTeamChat,
  deleteTeamChat,
} from "../../controllers/team/teamChatController";

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
