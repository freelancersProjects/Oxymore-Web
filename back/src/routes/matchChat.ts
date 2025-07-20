import { Router } from "express";
import {
  getAllMatchChats,
  createMatchChat,
  deleteMatchChat,
} from "../controllers/matchChatController";

const router = Router();

/**
 * @openapi
 * /api/match-chats:
 *   get:
 *     tags:
 *       - MatchChats
 *     summary: Récupère tous les messages de match
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get("/", getAllMatchChats);

/**
 * @openapi
 * /api/match-chats:
 *   post:
 *     tags:
 *       - MatchChats
 *     summary: Ajoute un message de match
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/MatchChatInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MatchChatInput'
 *     responses:
 *       201:
 *         description: Message ajouté
 */
router.post("/", createMatchChat);

/**
 * @openapi
 * /api/match-chats/{id}:
 *   delete:
 *     tags:
 *       - MatchChats
 *     summary: Supprime un message de match
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
router.delete("/:id", deleteMatchChat);

export default router;
