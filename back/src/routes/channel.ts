import { Router } from "express";
import {
  getAllChannels,
  getChannelById,
  getChannelsByUserId,
  createChannel,
} from "../controllers/channelController";

const router = Router();

/**
 * @openapi
 * /api/channels:
 *   get:
 *     tags:
 *       - Channels
 *     summary: Récupère tous les channels
 *     responses:
 *       200:
 *         description: Liste des channels
 */
router.get("/", getAllChannels);

/**
 * @openapi
 * /api/channels/user/{user_id}:
 *   get:
 *     tags:
 *       - Channels
 *     summary: Récupère tous les channels d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des channels de l'utilisateur
 */
router.get("/user/:user_id", getChannelsByUserId);

/**
 * @openapi
 * /api/channels/{id}:
 *   get:
 *     tags:
 *       - Channels
 *     summary: Récupère un channel par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel trouvé
 *       404:
 *         description: Channel non trouvé
 */
router.get("/:id", getChannelById);

/**
 * @openapi
 * /api/channels:
 *   post:
 *     tags:
 *       - Channels
 *     summary: Crée un nouveau channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Channel'
 *     responses:
 *       201:
 *         description: Channel créé
 */
router.post("/", createChannel);

export default router; 