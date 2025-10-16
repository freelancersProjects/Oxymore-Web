import { Router } from "express";
import {
  getAllMessageBots,
  getMessageBotById,
  getMessageBotsByChannel,
  createMessageBot,
  deleteMessageBot,
} from "../../controllers/messaging/messageBotController";

const router = Router();

/**
 * @openapi
 * /api/message-bots:
 *   get:
 *     tags:
 *       - MessageBots
 *     summary: Récupère tous les messages bots ou ceux d'un channel
 *     parameters:
 *       - in: query
 *         name: channel_id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages bots
 */
router.get("/", (req, res) => {
  if (req.query.channel_id) {
    return getMessageBotsByChannel(req, res);
  }
  return getAllMessageBots(req, res);
});

/**
 * @openapi
 * /api/message-bots/{id}:
 *   get:
 *     tags:
 *       - MessageBots
 *     summary: Récupère un message bot par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message bot trouvé
 *       404:
 *         description: Message bot non trouvé
 */
router.get("/:id", getMessageBotById);

/**
 * @openapi
 * /api/message-bots:
 *   post:
 *     tags:
 *       - MessageBots
 *     summary: Crée un nouveau message bot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageBotInput'
 *     responses:
 *       201:
 *         description: Message bot créé
 */
router.post("/", createMessageBot);

/**
 * @openapi
 * /api/message-bots/{id}:
 *   delete:
 *     tags:
 *       - MessageBots
 *     summary: Supprime un message bot par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message bot supprimé
 */
router.delete("/:id", deleteMessageBot);

export default router;
