import { Router } from "express";
import {
  getAllMessages,
  getMessagesByChannelId,
  createMessage,
} from "../controllers/messageController";

const router = Router();

/**
 * @openapi
 * /api/messages:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Récupère tous les messages
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get("/", getAllMessages);

/**
 * @openapi
 * /api/messages/channel/{channel_id}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Récupère tous les messages d'un channel
 *     parameters:
 *       - in: path
 *         name: channel_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages du channel
 */
router.get("/channel/:channel_id", getMessagesByChannelId);

/**
 * @openapi
 * /api/messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Crée un nouveau message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message créé
 */
router.post("/", createMessage);

export default router; 