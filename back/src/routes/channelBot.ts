import { Router } from "express";
import {
  getChannelBotById,
  getChannelBotsByUserId,
  createChannelBot,
  updateChannelBotName,
  deleteChannelBot,
} from "../controllers/channelBotController";

/**
 * @openapi
 * components:
 *   schemas:
 *     ChannelBotInput:
 *       type: object
 *       required:
 *         - name
 *         - user_id
 *       properties:
 *         name:
 *           type: string
 *         user_id:
 *           type: string
 */
const router = Router();

/**
 * @openapi
 * /api/channel-bots:
 *   get:
 *     tags:
 *       - ChannelBots
 *     summary: Récupère les channel bots d'un utilisateur
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des channel bots
 */
router.get("/", getChannelBotsByUserId);

/**
 * @openapi
 * /api/channel-bots/{id}:
 *   get:
 *     tags:
 *       - ChannelBots
 *     summary: Récupère un channel bot par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel bot trouvé
 *       404:
 *         description: Channel bot non trouvé
 */
router.get("/:id", getChannelBotById);

/**
 * @openapi
 * /api/channel-bots:
 *   post:
 *     tags:
 *       - ChannelBots
 *     summary: Crée un nouveau channel bot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChannelBotInput'
 *     responses:
 *       201:
 *         description: Channel bot créé
 */
router.post("/", createChannelBot);


/**
 * @openapi
 * /api/channel-bots/{id}:
 *   patch:
 *     tags:
 *       - ChannelBots
 *     summary: Met à jour le nom d'un channel bot
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Channel bot mis à jour
 */
router.patch("/:id", updateChannelBotName);

/**
 * @openapi
 * /api/channel-bots/{id}:
 *   delete:
 *     tags:
 *       - ChannelBots
 *     summary: Supprime un channel bot par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel bot supprimé
 */
router.delete("/:id", deleteChannelBot);

export default router;
